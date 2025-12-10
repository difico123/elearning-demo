import { generateAvatar } from './../../common/ultils';
import { NotificationService } from './../notification/service/notification.service';
import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  HttpStatus,
  Body,
  Res,
  Headers,
  Param,
  UsePipes,
  ConflictException,
  Query,
  Put,
} from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ErrorResponse,
  SuccessResponse,
} from 'src/common/helpers/api.response';
// import { MailService } from 'src/modules/mail/mail.service'; // Temporarily disabled
import { PasswordBody, VerifyEmail } from './dto/sign-up.dto';
import { Response, Request } from 'express';
import { GoogleOAuthGuard } from './guard/google-auth.guard';
import {
  UserResponse,
  IUserReq,
  IVerifyUserJwt,
  IUserJwt,
} from 'src/common/interfaces';
import { UserService } from '../user/service/user.service';
import { v4 as uuidv4 } from 'uuid';
import {
  LoginBodyValidation,
  SelectRoleValidation,
  TokenValidation,
  validation,
  VerifyCodeValidation,
} from './joi.request.pipe';
import { JWTAuthGuard } from './guard/jwt-auth.guard';
import { LoginBody } from './dto/login-dto';
import { filterUser } from 'src/common/ultils';
import { ForgotPasswordDto, VerifyCodeDto } from './dto/forgot-password.dto';
import { Provider, Role } from 'database/constant';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorator/custom.decorator';
import { Auth } from 'src/common/decorator/auth.decorator';
import { RoleDto } from './dto/role.dto';
import { RedisCacheService } from '../cache/redis-cache.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private readonly mailService: MailService, // Temporarily disabled
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    let { user } = (await this.authService.googleLogin(req)) as UserResponse;
    let { accessToken } = await this.authService.signUserJwt(user);
    res.redirect(`${process.env.FRONTEND_URL}auth/google/${accessToken}`);
  }

  @Post('signup')
  async signUpEmail(@Body() verifyEmail: VerifyEmail, @Res() res: Response) {
    const { email, url } = verifyEmail;
    let user = await this.userService.findOneByEmail(email);

    if (user) {
      return res
        .status(HttpStatus.CONFLICT)
        .json(
          new ErrorResponse(HttpStatus.CONFLICT, 'This email is already exist'),
        );
    }

    let id = uuidv4();
    let { accessToken } = await this.authService.signVerifyUserJwt({
      email,
      id,
    });
    let avatar = generateAvatar(id);
    let hashpw = await this.authService.hashPw('12345678');

    await Promise.all([
      // this.mailService?.sendUserEmailConfirmation( // Temporarily disabled
      //   { email, username: email.split('@')[0] },
      //   url + accessToken,
      // ),

      this.userService.saveUser({
        id,
        email,
        verified: false,
        password: hashpw,
        username: email?.split('@')[0],
        avatar,
      }),
    ]);

    return res.status(HttpStatus.OK).json(new SuccessResponse(email));
  }

  @Get('verify-email/:token')
  @UsePipes(TokenValidation)
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    let user = await this.authService.verifyEmail(token);
    return res.status(HttpStatus.OK).json(new SuccessResponse(user));
  }

  @Post('change-password')
  @UsePipes(
    TokenValidation,
    ...validation({ key: 'passwordChangeSchema', type: 'body' }),
  )
  @UseGuards(JWTAuthGuard)
  async changePassword(
    @Req() req: IUserReq<IVerifyUserJwt>,
    @Body() body: PasswordBody,
    @Res() res: Response,
  ) {
    let { id } = req.user;
    let user = await this.authService.changePasswordById(id, body.password);
    return res.status(HttpStatus.OK).json(new SuccessResponse(user));
  }

  @Post('login')
  @UsePipes(LoginBodyValidation)
  async login(
    @Body() body: LoginBody,
    @Res() res: Response,
    @Req() req: IUserReq<IUserJwt>,

    @Headers('host') host: Headers,
  ) {
    const { email, password } = body;
    let user = await this.authService.validateLocalUser(email, password);
    let unreadNotification =
      await this.notificationService.countUnreadNotification(user.id);

    const { accessToken } = await this.authService.signUserJwt({
      email,
      id: user.id,
      username: user.username,
      role: user.role,
    });
    const { avatar } = user;

    user.avatar = avatar?.startsWith('http')
      ? avatar
      : `${req.protocol}://${host}/user/image/${avatar}`;

    return res.status(HttpStatus.OK).json(
      new SuccessResponse({
        user: { ...filterUser(user), unreadNotification },
        accessToken,
      }),
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res: Response) {
    const { email, url } = body;
    let user = await this.authService.existEmail(email);

    if (user.provider !== Provider.local) {
      throw new ConflictException('this email not logged in with local');
    }

    //generate token
    let { code, token, time } = await this.authService.generateAuthToken();

    // send email
    // save token to db
    await Promise.all([
      // this.mailService?.sendResetPasswordLink( // Temporarily disabled
      //   email,
      //   url + `?email=${email}&code=${code}`,
      // ),
      this.authService.saveResetToken(user.id, token, time),
    ]);
    return res.status(HttpStatus.OK).json(new SuccessResponse());
  }

  @Post('verify-code')
  @UsePipes(VerifyCodeValidation)
  async verifyCode(@Query() query: VerifyCodeDto, @Res() res: Response) {
    const { email, code } = query;
    let user = await this.authService.existEmail(email);
    let { accessToken } = await this.authService.generateTokenByCode(
      code,
      user,
    );
    return res.status(HttpStatus.OK).json(new SuccessResponse({ accessToken }));
  }

  @Put('select-role')
  @UsePipes(SelectRoleValidation)
  @Auth(Role.guest)
  @ApiOperation({ summary: 'Save Reason Code' })
  @ApiBody({
    description: 'Reason Code',
    required: true,
    type: RoleDto,
  })
  async selectRole(
    @User() user: IUserJwt,
    @Res() res: Response,
    @Body('role') role: Role,
  ) {

    this.redisCacheService.deleteByKey(`user${user.id}`),
    await this.userService.updateUser(user.id, {
      role,
    });
    return res.status(HttpStatus.OK).json(new SuccessResponse());
  }
}
