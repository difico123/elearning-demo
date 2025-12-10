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
  NotFoundException,
  StreamableFile,
  UnauthorizedException,
} from '@nestjs/common';
import { SuccessResponse } from 'src/common/helpers/api.response';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UserService } from 'src/modules/user/service/user.service';
import { JWTAuthGuard } from '../auth/guard/jwt-auth.guard';
import { IUserJwt, IUserReq } from 'src/common/interfaces';
import { AuthService } from '../auth/service/auth.service';
import { filterUser, mysqlTimeStamp, removeImageFile } from 'src/common/ultils';
import { Response } from 'express';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { validation } from './joi.request.pipe';
import { UserChangeDto } from './dto/user';
import LocalFilesInterceptor, {
  imageParams,
} from 'src/infra/local-file/local-files.interceptor';
import { RedisCacheService } from '../cache/redis-cache.service';
import { User } from './entity/user.entity';
const fs = require('fs');
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

    user.avatar =
      avatar && avatar?.startsWith('http')
        ? avatar
        : `${req.protocol}://${host}/user/image/${avatar}` || '';

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
  @UseInterceptors(LocalFilesInterceptor(imageParams('avatar')))
  @UsePipes(...validation({ type: 'body', key: 'userChangeSchema' }))
  async editProfile(
    @Req() req: IUserReq<IUserJwt>,
    @Res() res: Response,
    @Body() body: UserChangeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let avatar = file?.filename;
    const { username, phone, address, password, currentPassword } = body;

    let existUser = await this.authService.existEmail(req.user.email);

    if (existUser.avatar && !existUser.avatar?.startsWith('http')) {
      removeImageFile(existUser.avatar, 'avatar');
    }

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
        avatar,
        username,
        phone,
        address,
        password: hashedPassword,
      }),
      this.cacheManager.deleteByKey(`user${req.user.id}`),
    ]);
    return res.status(HttpStatus.OK).json(new SuccessResponse());
  }

  @Get('image/:name')
  @ApiParam({ name: 'name' })
  @ApiResponse({ status: 200, description: 'Found image.' })
  @ApiResponse({ status: 404, description: 'Not Found Image.' })
  Category(
    @Param('name') name: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    let path = join(process.cwd(), `/uploads/avatar/${name}`);

    if (!fs.existsSync(path)) {
      throw new NotFoundException('Not found image');
    }
    const stream = createReadStream(path);

    response.set({
      'Content-Disposition': `inline; filename="${name}"`,
      'Content-Type': 'image/jpeg',
    });

    return new StreamableFile(stream);
  }
}
