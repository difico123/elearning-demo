import { UserService } from 'src/modules/user/service/user.service';
import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Query,
  Headers,
  Patch,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { NotificationService } from './service/notification.service';
import { IUserJwt } from 'src/common/interfaces';
import { User } from 'src/common/decorator/custom.decorator';
import { SuccessResponse } from 'src/common/helpers/api.response';
import { JWTAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  NotificationListResponse,
  QueryNotificationDto,
} from './dto/notification.dto';
import { defaultResponseTime, getPaginatedItems } from 'src/common/ultils';
import { NotificationType } from 'database/constant';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notification: NotificationService,
    private readonly userService: UserService,
  ) {}

  @Post('send')
  @UseGuards(JWTAuthGuard)
  async sendNotification(@Res() res: Response, @User() user: IUserJwt) {
    let newNotification = {
      userId: '123456abc',
      type: NotificationType.studentJoinCourse,
      sourceId: '123456abf',
      parentId: 1,
      isRead: false,
      title: 'Học sinh tham gia khóa học',
      description: `học sinh ${user.username} đã tham gia khóa học fex của bạn`,
    };

    await this.notification.saveNotification(newNotification);
    return res.status(HttpStatus.OK).json(new SuccessResponse());
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  async getNotification(
    @Req() req: Request,
    @Res() res: Response,
    @User() user: IUserJwt,
    @Query() query: QueryNotificationDto,
    @Headers('host') host: Headers,
  ) {
    let { page, pageSize } = query;
    let notification = await this.notification.getNotificationsByUserId(
      user.id,
    );
    let data = await Promise.all(
      notification[0].map(async (item) => {
        let avatar = '';

        if (item?.sourceId) {
          avatar = (await this.userService.findOneById(item.sourceId))?.avatar;
        }

        return { ...item, avatar: (avatar && avatar) || undefined };
      }),
    );

    let items = data.map((item: any) => {
      let { created_at, updated_at, avatar } = item || {};

      return {
        ...item,
        avatar:
          avatar && avatar?.startsWith('http')
            ? avatar
            : `${req.protocol}://${host}/user/image/${avatar}` || '',
        ...defaultResponseTime(created_at, updated_at),
      };
    });

    let response: NotificationListResponse = {
      ...getPaginatedItems(items, +page, +pageSize),
      totalItems: notification[1],
    };
    return res.status(HttpStatus.OK).json(new SuccessResponse(response));
  }

  @Patch()
  @UseGuards(JWTAuthGuard)
  async readNotification(@Res() res: Response, @User() user: IUserJwt) {
    let notification = await this.notification.readNotification(user.id);
    return res.status(HttpStatus.OK).json(new SuccessResponse(notification));
  }
}
