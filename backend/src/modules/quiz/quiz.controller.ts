import { QuestionService } from './../question/service/question.service';
import { mysqlToTimeStamp, timeStampToMysql } from 'src/common/ultils';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
  Headers,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  Instructor,
  Student,
  User,
} from 'src/common/decorator/custom.decorator';
import {
  CourseAuth,
  InstructorCourseAuth,
} from 'src/common/decorator/auth.decorator';
import { SuccessResponse } from 'src/common/helpers/api.response';
import {
  BulkQuizInsertDto,
  BulkQuizUpdateDto,
  CreateQuizDto,
  IEditQuizParam,
  IQuizParam,
  QuizListResponseDto,
} from './dto/dto';
import { QuizService } from './service/quiz.service';
import { validation } from './joi.request.pipe';
import { Course } from '../course/entity/course.entity';
import { UserCourse } from '../user-courses/entity/user-course.entity';
import { UserQuiz } from '../user-quiz/entity/user-quiz.entity';
import { UserQuizService } from '../user-quiz/service/user-quiz.service';
import { Answer } from './entity/answer.entity';
import { Question } from './entity/question.entity';
import { IUserJwt } from 'src/common/interfaces';
import { Quiz } from './entity/quiz.entity';
import { TopicService } from '../topics/service/topic.service';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly userQuiz: UserQuizService,
    private readonly topicService: TopicService,
  ) {}

  @Get('rank/:courseId')
  async rankCourses(
    @Res() res: Response,
    @Param() param: { courseId: string },
  ) {
    const { courseId } = param;

    const courseRank = await this.quizService.rankCourse(+courseId);
    return res.status(HttpStatus.OK).json(new SuccessResponse(courseRank));
  }

  @Get('/:courseId/:topicId')
  @UsePipes(...validation({ key: 'topicIdParamSchema', type: 'param' }))
  @CourseAuth()
  async getShortTopics(
    @User() user: IUserJwt,
    @Res() response: Response,
    @Param() param: IQuizParam,
    @Req() req: Request,
    @Student() student: UserCourse,
    @Headers('host') host: Headers,
  ) {
    const { topicId, courseId } = param;

    const topic = await this.topicService.existTopic(+topicId);
    if (topic.courseId !== +courseId) {
      throw new ForbiddenException('topic does not belong to course');
    }

    let quizes = await this.quizService.getBulks(
      +topicId,
      student?.userId,
      +courseId,
    );

    quizes = quizes.map((item) => {
      const { startTime } = item;
      return {
        ...item,
        startTime: mysqlToTimeStamp(startTime),
      };
    });

    const res: QuizListResponseDto = {
      items: quizes,
      totalItems: quizes.length,
    };
    return response.status(HttpStatus.OK).json(new SuccessResponse(res));
  }

  @Get('/:courseId/:topicId')
  @UsePipes(...validation({ key: 'topicIdParamSchema', type: 'param' }))
  @CourseAuth()
  async getTopics(
    @Req() req: Request,
    @Res() response: Response,
    @Param() param: { courseId: number },
    @Headers('host') host: Headers,
  ) {
    return response.status(HttpStatus.OK).json(new SuccessResponse('res'));
  }

  @Post('/:courseId/:topicId')
  @InstructorCourseAuth()
  async createTopics(
    @Res() res: Response,
    @Instructor() instructor: Course,
    @Param() param: IQuizParam,
    @Body() body: BulkQuizInsertDto,
  ) {
    const { topicId, courseId } = param;

    const topic = await this.topicService.existTopic(+topicId);
    if (topic.courseId !== +courseId) {
      throw new ForbiddenException('topic does not belong to course');
    }

    const quiz = await this.quizService.saveQuizBulk(body, +topicId);

    return res.status(HttpStatus.OK).json(new SuccessResponse(quiz));
  }

  @Put('/:courseId/:quizId')
  @InstructorCourseAuth()
  @UsePipes(
    ...validation(
      { key: 'updateQuizParamSchema', type: 'param' },
      { key: 'bulkQuizUpdateSchema', type: 'body' },
    ),
  )
  async updateQuiz(
    @Res() res: Response,
    @Instructor() instructor: Course,
    @Param() param: IEditQuizParam,
    @Body() body: BulkQuizUpdateDto,
    @Req() req: Request,
  ) {
    const { quizId, courseId } = param;
    const result = await this.quizService.updateQuizBulk(
      +quizId,
      +courseId,
      body,
    );
    return res.status(HttpStatus.OK).json(new SuccessResponse(result));
  }

  @Delete(':courseId/:quizId')
  @InstructorCourseAuth()
  @UsePipes(...validation({ key: 'updateQuizParamSchema', type: 'param' }))
  async deleteQuiz(
    @Res() res: Response,
    @Instructor() instructor: Course,
    @Param() param: IEditQuizParam,
  ) {
    const { quizId, courseId } = param;
    const quizExist = await this.quizService.existQuiz(+quizId);
    const topic = await this.topicService.existTopic(quizExist.topicId);
    if (topic.courseId !== +courseId) {
      throw new ForbiddenException('quiz does not belong to course');
    }
    const result = await this.quizService.deleteQuiz(+quizId);
    await this.userQuiz.deleteQuizByQuizId(+quizId);
    return res.status(HttpStatus.OK).json(new SuccessResponse(result));
  }
}
