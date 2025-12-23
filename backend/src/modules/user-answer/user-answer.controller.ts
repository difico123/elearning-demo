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
    @Body() body: Array<{ questionId: number; answerIds?: number[]; answerText?: string }>,
    @User() user: IUserJwt,
  ) {
    const { quizId } = param;

    let questions: {
      questionId: number;
      mark: number;
      type: string;
      answerList: {
        isCorrect: boolean;
        answerId: number;
        content: string;
      }[];
    }[] = [];
    let answerIds: number[] = [];
    
    const answerListData = await this.quizService.getAnswerList(quizId);
    
    answerListData.forEach((item) => {
      let index = questions.findIndex(
        (questionItem) => questionItem.questionId === item.questionId,
      );
      let newAnswer = {
        isCorrect: item.isCorrect,
        answerId: item.answerId,
        content: item.content,
      };
      if (index !== -1) {
        questions[index].answerList.push(newAnswer);
      } else {
        let newQuestion = {
          questionId: item.questionId,
          mark: item.mark,
          type: item.type || 'multiple_choice',
          answerList: [newAnswer],
        };
        questions.push(newQuestion);
      }
      answerIds.push(item.answerId);
    });

    let userAnswerIds = await this.userAnswerService.getUserAnswerByQuizId(
      quizId,
      user.id,
    );

    let userQuiz = await this.userAnswerService.getUserAnswerQuiz(
      quizId,
      user.id,
    );
    
    // Check if user already answered
    if (userQuiz) {
      throw new BadRequestException('you answered this quiz already');
    }

    // Validate that all submitted answer IDs are valid
    const allSubmittedAnswerIds: number[] = [];
    body.forEach((item) => {
      if (item.answerIds) {
        allSubmittedAnswerIds.push(...item.answerIds);
      }
    });
    
    if (allSubmittedAnswerIds.some((id) => !answerIds.includes(id))) {
      throw new BadRequestException('Invalid answer IDs submitted');
    }

    let markTotal = 0;
    const savedUserAnswers: any[] = [];

    // Score each question based on type
    for (const questionItem of questions) {
      const { mark, answerList, type, questionId } = questionItem;
      const userAnswer = body.find((a) => a.questionId === questionId);
      
      if (!userAnswer) {
        continue; // Skip if no answer provided
      }

      let isCorrect = false;

      if (type === 'short_answer' || type === 'single_choice') {
        // Short answer and single choice: exactly one answer selected, must be the correct one
        if (userAnswer.answerIds && userAnswer.answerIds.length === 1) {
          const selectedAnswerId = userAnswer.answerIds[0];
          const correctAnswer = answerList.find((a) => a.isCorrect);
          if (correctAnswer && correctAnswer.answerId === selectedAnswerId) {
            isCorrect = true;
            markTotal += mark;
          }
        }
      } else {
        // Multiple choice: all correct answers selected, all incorrect not selected
        let totalMatch = 0;
        for (let i = 0; i < answerList.length; i++) {
          let { isCorrect: answerIsCorrect, answerId } = answerList[i];
          const isSelected = userAnswer.answerIds?.includes(answerId) || false;
          if (answerIsCorrect && isSelected) {
            totalMatch += 1;
          } else if (!answerIsCorrect && !isSelected) {
            totalMatch += 1;
          }
        }

        if (totalMatch === answerList.length) {
          isCorrect = true;
          markTotal += mark;
        }
      }

      // Save user answers
      if (type === 'short_answer' && userAnswer.answerText) {
        // For short answer, we might need a different storage mechanism
        // For now, we'll store it in a way that can be retrieved
        // This might require a new table or field
        // For compatibility, we'll skip saving short answer text for now
        // and handle it differently
      } else if (userAnswer.answerIds) {
        for (const answerId of userAnswer.answerIds) {
          if (answerIds.includes(answerId)) {
            const newUserAnswer = {
              userId: user.id,
              answerId,
            };
            savedUserAnswers.push(
              await this.userAnswerService.save(newUserAnswer),
            );
          }
        }
      }
    }

    await this.userAnswerService.saveQuiz({
      userId: user.id,
      quizId,
      markTotal,
    });

    return res.status(HttpStatus.OK).json(
      new SuccessResponse({
        questions,
        markTotal,
        userAnswerIds,
        userAnswer: savedUserAnswers,
      }),
    );
  }
}
