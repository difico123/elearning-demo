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
  Query,
  Delete,
  NotFoundException,
  BadRequestException,
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
  CreateQuizDto,
  IEditQuizDto,
  IEditQuizParam,
  IQueryEditDto,
  IQuizParam,
  IUpdateQuizDto,
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

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly userQuiz: UserQuizService,
  ) {}

  @Get('rank/:courseId')
  async rankCourses(
    @Res() res: Response,
    @Param() param: { courseId: string },
    @Query() query: IQueryEditDto,
  ) {
    const { courseId } = param;

    let courseRank = await this.quizService.rankCourse(+courseId);
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
    const { topicId } = param;

    let quizes = await this.quizService.getBulks(+topicId, student?.userId);

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
    const { topicId } = param;

    let quiz = await this.quizService.saveQuizBulk(body, +topicId);

    return res.status(HttpStatus.OK).json(new SuccessResponse(quiz));
  }

  @Put(':courseId/:quizId')
  @InstructorCourseAuth()
  @UsePipes(
    ...validation(
      { key: 'updateQuizParamSchema', type: 'param' },
      { key: 'editQuizQuerySchema', type: 'query' },
    ),
  )
  async updateQuiz(
    @Res() res: Response,
    @Instructor() instructor: Course,
    @Param() param: IEditQuizParam,
    @Body() body: IUpdateQuizDto,
    @Query() query: IQueryEditDto,
  ) {
    const { sourceId, type } = query;
    let { answer, question, quiz } = body;

    let { quizId } = param;

    let quizExist = await this.quizService.existQuiz(+quizId);
    if (!quizExist) {
      throw new NotFoundException('not found quiz');
    }

    let result: any;

    if (type === 'answer' && !!answer) {
      if (quizExist.isEdit) {
        throw new BadRequestException('can not editing');
      }

      result = await this.quizService.updateAnswerOnly(sourceId, answer);
    } else if (type === 'question' && !!question) {
      if (quizExist.isEdit) {
        throw new BadRequestException('can not editing');
      }

      result = await this.quizService.updateQuestionOnly(sourceId, question);
    } else if (type === 'quiz' && !!quiz) {
      let isEdit = false;
      if (quiz.shown && !quizExist.isEdit) {
        isEdit = true;
      } else if (quizExist.isEdit) {
        isEdit = true;
      }
      let newQuiz: Partial<Quiz> = {
        ...quiz,
        isEdit,
      };

      result = await this.quizService.updateQuizOnly(+quizId, newQuiz);
    } else if (type === 'addAnswer' && !!answer) {
      let newAnswer: Partial<Answer> = {
        questionId: sourceId,
        content: answer.content,
        isCorrect: answer.isCorrect,
      };
      result = await this.quizService.saveAnswer(newAnswer);
    } else if (type === 'addQuestion' && !!question) {
      let newQuestion: Partial<Question> = {
        quizId: sourceId,
        name: question.name,
        mark: question.mark,
      };
      result = await this.quizService.saveQuestion(newQuestion);
    }

    return res.status(HttpStatus.OK).json(
      new SuccessResponse({
        result,
      }),
    );
  }

  @Delete(':courseId/:quizId')
  @InstructorCourseAuth()
  @UsePipes(
    ...validation(
      { key: 'updateQuizParamSchema', type: 'param' },
      { key: 'editQuizQuerySchema', type: 'query' },
    ),
  )
  async deleteQuiz(
    @Res() res: Response,
    @Instructor() instructor: Course,
    @Param() param: IEditQuizParam,
    @Query() query: IQueryEditDto,
  ) {
    const { sourceId, type } = query;
    let { quizId } = param;
    let quizExist = await this.quizService.existQuiz(+quizId);
    if (!quizExist) {
      throw new NotFoundException('not found quiz');
    }
    let result: any;

    switch (type) {
      case 'answer': {
        if (quizExist.isEdit) {
          throw new NotFoundException('can not delete answer');
        }
        result = await this.quizService.deleteAnswer(sourceId);
        break;
      }
      case 'question': {
        if (quizExist.isEdit) {
          throw new NotFoundException('can not delete question');
        }
        result = await this.quizService.deleteQuestion(sourceId);
        break;
      }
      case 'quiz': {
        result = await this.quizService.deleteQuiz(sourceId);
        await this.userQuiz.deleteQuizByQuizId(sourceId);
        break;
      }
    }

    return res.status(HttpStatus.OK).json(new SuccessResponse(result));
  }
}
