import { RedisCacheService } from './../cache/redis-cache.service';
import { getMonthText } from './../../common/ultils';
import { filterUser, removeImageFile } from 'src/common/ultils';
import { NotificationService } from '../notification/service/notification.service';
import { Role } from 'database/constant';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UsePipes,
  Headers,
  Req,
  Put,
  BadRequestException,
  Body,
  Delete,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminService } from './service/admin.service';
import { IUserJwt, IUserReq } from 'src/common/interfaces';

import { validation } from './joi.request.pipe';
import { SuccessResponse } from 'src/common/helpers/api.response';
import {
  courseParam,
  EditCourseDto,
  EditUserDto,
  UpdateRole,
  userParam,
} from './dto/admin.dto';
import { CourseService } from '../course/service/course.service';
import { AuthService } from '../auth/service/auth.service';
import { LoginBody } from '../auth/dto/login-dto';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserService } from '../user/service/user.service';
import { User } from '../user/entity/user.entity';
import { STRIPE_CLIENT } from 'src/common/constant';
import Stripe from 'stripe';
import { UserCourseService } from '../user-courses/service/user-course.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly notification: NotificationService,
    private readonly courseService: CourseService,
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly userCourseService: UserCourseService,
    private readonly cacheManager: RedisCacheService,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
  ) {}

  @Get('users')
  @Auth('admin')
  async getUsers(
    @Body() body: LoginBody,
    @Res() res: Response,
    @Req() req: IUserReq<IUserJwt>,
    @Headers('host') host: Headers,
  ) {
    let users = await this.adminService.getAllUsers();
    return res.status(HttpStatus.OK).json(new SuccessResponse(users));
  }

  @Get('courses')
  @Auth('admin')
  async getCourses(
    @Res() res: Response,
    @Req() req: IUserReq<IUserJwt>,
    @Headers('host') host: Headers,
  ) {
    let courses = await this.adminService.getAllCourses();
    courses = courses.map((item) => {
      const { avatar, image } = item;
      return {
        ...item,
        avatar:
          avatar && avatar?.startsWith('http')
            ? avatar
            : `${req.protocol}://${host}/user/image/${avatar}` || '',
        image:
          image && image?.startsWith('http')
            ? image
            : `${req.protocol}://${host}/course/image/${image}` || '',
      };
    });
    return res.status(HttpStatus.OK).json(new SuccessResponse(courses));
  }

  @Put('courses/:courseId')
  @Auth('admin')
  @UsePipes(
    ...validation(
      {
        key: 'editCourseChema',
        type: 'body',
      },
      {
        key: 'courseParamSchema',
        type: 'param',
      },
    ),
  )
  async editCourses(
    @Body() body: EditCourseDto,
    @Res() res: Response,
    @Param() param: courseParam,
  ) {
    const { courseId } = param;

    const { name, price, isPublished } = body;
    if (!name && !price && !isPublished) {
      throw new BadRequestException();
    }

    let updateCourse: any = {};
    if (name) {
      updateCourse.name = name;
    }
    if (price) {
      updateCourse.price = price;
    }
    if (isPublished) {
      updateCourse.isPublished = isPublished;
    }

    let updateCoures = await this.courseService.updateCourse(
      +courseId,
      updateCourse,
    );

    return res.status(HttpStatus.OK).json(new SuccessResponse(updateCoures));
  }

  @Put('users/:userId')
  @Auth('admin')
  @UsePipes(
    ...validation(
      {
        key: 'editUserChema',
        type: 'body',
      },
      {
        key: 'userParamSchema',
        type: 'param',
      },
    ),
  )
  async editUser(
    @Body() body: EditUserDto,
    @Res() res: Response,
    @Req() req: IUserReq<IUserJwt>,
    @Headers('host') host: Headers,
    @Param() param: userParam,
  ) {
    const { userId } = param;

    let existUser = await this.userService.findOneById(userId);

    if (!existUser) {
      throw new BadRequestException('user not found');
    }
    const { username, phone, address, password } = body;

    if (!username && !phone && !password && !address) {
      throw new BadRequestException();
    }

    let updateUser: any = {};
    if (username) {
      updateUser.username = username;
    }
    if (phone) {
      updateUser.phone = phone;
    }
    if (address) {
      updateUser.address = address;
    }
    if (password) {
      const hashedPassword = await this.authService.hashPw(password);
      updateUser.password = hashedPassword;
    }

    let updateCoures = await this.userService.updateUser(userId, updateUser);

    return res.status(HttpStatus.OK).json(new SuccessResponse(updateCoures));
  }

  @Delete('users/:userId')
  @Auth('admin')
  @UsePipes(...validation({ type: 'param', key: 'userParamSchema' }))
  async deleteCourse(
    @Res() res: Response,
    @Param() params: { userId: string },
  ) {
    const userExist = await this.userService.findOneById(params.userId);
    if (!userExist) {
      throw new BadRequestException('user is not exist');
    }
    const { id, avatar } = userExist;
    await this.cacheManager.deleteByKey(`user${id}`);

    try {
      if (avatar) {
        removeImageFile(avatar, 'avatar');
      }
      await Promise.all([this.userService.delete(id)]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return res.status(HttpStatus.OK).json(new SuccessResponse());
  }

  @Put('users/role/:userId')
  @Auth('admin')
  @UsePipes(
    ...validation(
      {
        key: 'roleBodySchema',
        type: 'body',
      },
      {
        key: 'userParamSchema',
        type: 'param',
      },
    ),
  )
  async updateUserRole(
    @Body() body: UpdateRole,
    @Res() res: Response,
    @Req() req: IUserReq<IUserJwt>,
    @Headers('host') host: Headers,
    @Param() param: userParam,
  ) {
    const { userId } = param;

    let existUser = await this.userService.findOneById(userId);

    if (!existUser) {
      throw new BadRequestException('user not found');
    }
    const { role } = body;
    if (existUser.role === role) {
      throw new BadRequestException(`you are become a ${role} already`);
    }
    let roleException = [Role.admin, Role.instructor, Role.student];

    if (roleException.includes(existUser.role)) {
      throw new BadRequestException('can not update role');
    }

    let updateCoures: Partial<User> = {};
    if (existUser.role === Role.pending) {
      updateCoures = await this.userService.updateUser(userId, {
        role: Role.instructor,
      });
    } else {
      updateCoures = await this.userService.updateUser(userId, { role: role });
    }

    return res.status(HttpStatus.OK).json(new SuccessResponse(updateCoures));
  }

  @Post('login')
  @UsePipes(
    ...validation({
      key: 'loginSchema',
      type: 'body',
    }),
  )
  async login(
    @Body() body: LoginBody,
    @Res() res: Response,
    @Req() req: IUserReq<IUserJwt>,
    @Headers('host') host: Headers,
  ) {
    const { email, password } = body;
    let user = await this.authService.validateLocalUser(email, password);

    if (user.role !== Role.admin) {
      throw new BadRequestException('incorrect role');
    }
    if (!user.verified) {
      throw new BadRequestException('this email is not verified');
    }
    let unreadNotification = await this.notification.countUnreadNotification(
      user.id,
    );

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

  @Get('')
  @Auth('admin')
  async getStatistic(
    @Body() body: LoginBody,
    @Res() res: Response,
    @Req() req: IUserReq<IUserJwt>,
    @Headers('host') host: Headers,
  ) {
    let instructorTotal = await this.userService.countUser(Role.instructor);
    let studentTotal = await this.userService.countUser(Role.student);
    let userTotal = await this.userService.countUser();
    let revenue = await this.stripe.balance.retrieve();
    let userCourses = await this.userCourseService.find();

    let data: { x?: number; y?: number } = {};
    userCourses.forEach((item) => {
      const { startCourseTime } = item;
      let month = new Date(startCourseTime).getMonth();
      let year = new Date(startCourseTime).getFullYear();

      if (year === new Date().getFullYear()) {
        data[month] = data[month] + 1 || 1;
      }
    });

    let chart = Object.keys(data).map((item) => {
      return {
        x: item,
        y: data[item],
      };
    });

    chart = chart
      .sort((a, b) => (+a.x > +b.x ? 1 : -1))
      .map((item) => {
        return {
          ...item,
          x: getMonthText(+item.x),
        };
      });

    let response = {
      instructorTotal,
      studentTotal,
      userTotal,
      revenue: revenue.available[0].amount,
      chart,
    };
    this.userService.getUsers();
    return res.status(HttpStatus.OK).json(new SuccessResponse(response));
  }
}
