import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { IGoogleUser } from '../../../common/constant';
import {
  filterUser,
  generateDigits,
  hasResetTokenExpired,
} from 'src/common/ultils';
import { User } from 'src/modules/user/entity/user.entity';
import { IUserJwt, IVerifyUserJwt } from 'src/common/interfaces';
import { Provider, Role } from 'database/constant';
import * as bcrypt from 'bcryptjs';
import { VerifyCodeUser } from '../dto/forgot-password.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    let { id, email, avatar, username } = req.user as IGoogleUser;

    let userDb = await this.userService.findGoogleUser(email);
    if (!userDb) {
      let newUser = {
        id,
        email,
        avatar,
        username,
        role: Role.guest,
        verified: true,
        provider: Provider.google,
      };
      userDb = await this.userService.saveUser(newUser);
    }

    return {
      user: filterUser(userDb),
    };
  }

  async verifyEmail(token: string): Promise<any> {
    // Validate token. Will throw error if it's not valid.
    let userFromTokenPayload: IVerifyUserJwt;
    try {
      userFromTokenPayload = await this.decodeToken(token);
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
    let user = await this.userService.findOneById(userFromTokenPayload.id);

    if (!user) {
      throw new BadRequestException('User is not registered');
    } else if (user.verified) {
      throw new BadRequestException('User is verified');
    }

    // Update email verification status.
    let verifyUser = await this.userService.updateUser(
      userFromTokenPayload.id,
      {
        verified: true,
      },
    );

    return { user: filterUser(verifyUser) };
  }

  async changePasswordById(id: string, password: string): Promise<any> {
    // Validate token. Will throw error if it's not valid.
    let user = await this.userService.findOneById(id);

    if (!user) {
      throw new BadRequestException('User is not registered');
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    let newUser = await this.userService.updateUser(id, {
      password: hashedPassword,
    });

    return { user: filterUser(newUser) };
  }

  hashPw(password: string) {
    return bcrypt.hash(password, 8);
  }

  async existEmail(email: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Not found email');
    }
    return user;
  }

  async validateLocalUser(
    email: string,
    pass: string,
    customMessage?: string,
  ): Promise<User> {
    const user = await this.existEmail(email);

    // Accounts that are registered via oAuth should not be accessible via local signin.
    if (user.provider !== Provider.local) {
      throw new ConflictException('this email logged in with gooogle');
    }

    const isPasswordCorrect: boolean = await bcrypt.compare(
      pass,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(
        customMessage || 'Email or password incorrect.',
      );
    }

    return user;
  }

  comparePw(pw: string, hashPw: string) {
    return bcrypt.compare(pw, hashPw) as Promise<Boolean>;
  }

  async verifyCode(code: string, user: VerifyCodeUser, expiredTime?: number) {
    let { id, email, resetToken, expiredTokenTime } = user;

    if (!resetToken || !expiredTokenTime) {
      throw new BadRequestException("you haven't any token");
    }
    //check time
    let hasTokenExpired = hasResetTokenExpired(expiredTokenTime, expiredTime);
    if (hasTokenExpired) {
      throw new BadRequestException('your code has expired');
    }

    // compare code
    const isCodeCorrect: boolean = await bcrypt.compare(code, resetToken);

    if (!isCodeCorrect) {
      throw new BadRequestException('Invalid code');
    }

    return { email, id, isCodeCorrect };
  }

  async generateTokenByCode(code: string, user: VerifyCodeUser) {
    let { email, id } = await this.verifyCode(code, user);
    let token = this.signVerifyUserJwt({ email, id });
    await Promise.all([this.resetTokenById(id), token]);
    return token;
  }

  async resetTokenById(id: string) {
    this.userService.updateUser(id, {
      resetToken: null,
      expiredTokenTime: null,
    });
  }

  async generateAuthToken() {
    let code = generateDigits(6);
    let token = (await bcrypt.hash(`${code}`, 8)) as string;

    return {
      code,
      token,
      time: new Date(),
    };
  }

  async saveResetToken(id: string, resetToken: string, expiredTokenTime: Date) {
    let newUser = await this.userService.updateUser(id, {
      resetToken,
      expiredTokenTime,
    });
    return newUser;
  }

  async signUserJwt(user: IUserJwt) {
    const payload: IUserJwt = {
      email: user.email,
      id: user.id,
      role: user.role,
      username: user.username,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signVerifyUserJwt(user: IVerifyUserJwt) {
    const payload: IVerifyUserJwt = {
      email: user.email,
      id: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async decodeToken(token: string) {
    return this.jwtService.verify(token);
  }
}
