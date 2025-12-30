import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Put,
  UsePipes,
  Body,
  UseInterceptors,
  UploadedFile,
  Headers,
  BadRequestException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { SuccessResponse } from 'src/common/helpers/api.response';
import { UserService } from 'src/modules/user/service/user.service';
import { JWTAuthGuard } from '../auth/guard/jwt-auth.guard';
import { IUserJwt, IUserReq } from 'src/common/interfaces';
import { AuthService } from '../auth/service/auth.service';
import { filterUser, mysqlTimeStamp, generateAvatar } from 'src/common/ultils';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { validation } from './joi.request.pipe';
import { UserChangeDto } from './dto/user';
import { RedisCacheService } from '../cache/redis-cache.service';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { NotificationService } from '../notification/service/notification.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private authService: AuthService,
    private readonly cacheManager: RedisCacheService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('profile')
  @UseGuards(JWTAuthGuard)
  async getProfile(
    @Req() req: IUserReq<IUserJwt>,
    @Res() res: Response,
    @Headers('host') host: Headers,
  ) {

    let user = (await this.cacheManager.setOrgetCache(
      `user${req.user.id}`,
      async () => {
        return await this.authService.existEmail(req.user.email);
      },
    )) as User;
    // let user = await this.authService.existEmail(req.user.email);
    const { avatar, created_at, updated_at, email } = user;

    let unreadNotification =
      await this.notificationService.countUnreadNotification(user.id);

    const { accessToken } = await this.authService.signUserJwt({
      email,
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // Always use generated Gmail-style avatar
    user.avatar = generateAvatar(user.username || user.email || user.id || 'User');

    let userRes = {
      ...user,
      created_at: mysqlTimeStamp(created_at),
      updated_at: mysqlTimeStamp(updated_at),
      unreadNotification,
    };

    return res
      .status(HttpStatus.OK)
      .json(new SuccessResponse({ ...filterUser(userRes), accessToken }));
  }

  @Put('profile')
  @UseGuards(JWTAuthGuard)
  @UsePipes(...validation({ type: 'body', key: 'userChangeSchema' }))
  async editProfile(
    @Req() req: IUserReq<IUserJwt>,
    @Res() res: Response,
    @Body() body: UserChangeDto,
  ) {
    const { username, phone, address, password, currentPassword } = body;

    let existUser = await this.authService.existEmail(req.user.email);

    if (Object.keys(body).length < 1) {
      throw new BadRequestException();
    }

    if (currentPassword && password) {
      let isMatch = await this.authService.comparePw(
        currentPassword,
        existUser.password,
      );
      if (!isMatch) {
        throw new UnauthorizedException('currentPassword incorrect.');
      }
    }
    const hashedPassword =
      (password && (await bcrypt.hash(password, 8))) || undefined;
    await Promise.all([
      this.usersService.updateUser(req.user.id, {
        username,
        phone,
        address,
        password: hashedPassword,
      }),
      this.cacheManager.deleteByKey(`user${req.user.id}`),
    ]);
    return res.status(HttpStatus.OK).json(new SuccessResponse());
  }

}
