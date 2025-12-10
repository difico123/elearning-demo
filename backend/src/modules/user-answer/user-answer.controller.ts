import { IUserJwt } from 'src/common/interfaces';
import { UserAnswerService } from './service/user-answer.service';
import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StudentCourseAuth } from 'src/common/decorator/auth.decorator';
import { QuizService } from '../quiz/service/quiz.service';
import { QAParam } from './dto/dto';
import { validation } from './joi.request.pipe';
import { Response } from 'express';
import { SuccessResponse } from 'src/common/helpers/api.response';
import { User } from 'src/common/decorator/custom.decorator';

@ApiTags('UserAnswer')
@Controller('user-answer')
export class UserAnswerController {
  constructor(
    private readonly quizService: QuizService,
    private readonly userAnswerService: UserAnswerService,
  ) {}

  @Post('/:courseId/:quizId')
  @StudentCourseAuth()
  @UsePipes(...validation({ key: 'quizIdParamSchema', type: 'param' }))
  async createTopic(
    @Res() res: Response,
    @Param() param: QAParam,
    @Body() body: number[],
    @User() user: IUserJwt,
  ) {
    const { quizId } = param;

    let questions: {
      questionId: number;
      mark: number;
      answerList: {
        isCorrect: boolean;
        answerId: number;
      }[];
    }[] = [];
    let answerIds = await (
      await this.quizService.getAnswerList(quizId)
    ).map((item) => {
      let index = questions.findIndex(
        (questionItem) => questionItem.questionId === item.questionId,
      );
      let newAnswer = {
        isCorrect: item.isCorrect,
        answerId: item.answerId,
      };
      if (index !== -1) {
        questions[index].answerList.push(newAnswer);
      } else {
        let newQuestion = {
          questionId: item.questionId,
          mark: item.mark,
          answerList: [newAnswer],
        };
        questions.push(newQuestion);
      }
      return item.answerId;
    });
    let userAnswerIds = await this.userAnswerService.getUserAnswerByQuizId(
      quizId,
      user.id,
    );

    let userQuiz = await this.userAnswerService.getUserAnswerQuiz(
      quizId,
      user.id,
    );
    if (
      body.some((item) => {
        return userAnswerIds.includes(item);
      }) ||
      userQuiz
    ) {
      throw new BadRequestException('you answered this quiz already');
    }

    let markTotal = 0;

    questions.map((questionItem) => {
      let { mark, answerList } = questionItem;
      let totalMatch = 0;
      for (let i = 0; i < answerList.length; i++) {
        let { isCorrect, answerId } = answerList[i];
        if (isCorrect && body.includes(answerId)) {
          totalMatch += 1;
        } else if (!isCorrect && !body.includes(answerId)) {
          totalMatch += 1;
        }
      }

      if (totalMatch === answerList.length) {
        markTotal += mark;
      }
    });

    await this.userAnswerService.saveQuiz({
      userId: user.id,
      quizId,
      markTotal,
    });

    let answerObj = answerIds.reduce(
      (acc, answerId) => ({ ...acc, [answerId]: true }),
      {},
    );

    let userAnswer = await Promise.all(
      body.map((answerId) => {
        if (answerObj[answerId]) {
          let newUserAnswer = {
            userId: user.id,
            answerId,
          };
          return this.userAnswerService.save(newUserAnswer);
        }
      }),
    );

    return res.status(HttpStatus.OK).json(
      new SuccessResponse({
        questions,
        markTotal,
        userAnswerIds,
        userAnswer,
      }),
    );
  }
}
