import { AnswerService } from './../answer/service/question.service';
import { mysqlToTimeStamp, timeStampToMysql } from 'src/common/ultils';
import { UserCourseStatus } from 'database/constant';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  Headers,
  Inject,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { IUserJwt } from 'src/common/interfaces';
import { Instructor, User } from 'src/common/decorator/custom.decorator';
import {
  Auth,
  CourseAuth,
  InstructorCourseAuth,
  JoinCourseAuth,
} from 'src/common/decorator/auth.decorator';
import { SuccessResponse } from 'src/common/helpers/api.response';
import { CategoryService } from '../category/service/category.service';
import LocalFilesInterceptor, {
  imageParams,
  videoParams,
} from 'src/infra/local-file/local-files.interceptor';
import { STRIPE_CLIENT } from 'src/common/constant';
import Stripe from 'stripe';
import { CourseService } from '../course/service/course.service';
import { AuthService } from '../auth/service/auth.service';
import { Question } from './entity/question.entity';
import moment from 'moment';
import { JoinCourseGuard } from 'src/common/guard/student-course.guard';
import { QuestionService } from './service/question.service';
import { validation } from './joi.request.pipe';
import { Course } from '../course/entity/course.entity';

@ApiTags('Question')
@Controller('question')
export class QuestionController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('/:courseId/:quizId')
  @InstructorCourseAuth()
  async createTopic(
    @Res() res: Response,
    @Instructor() instructor: Course,
    @Param() param: {},
    @Body() body: {},
  ) {
    return res.status(HttpStatus.OK).json(new SuccessResponse());
  }
}
