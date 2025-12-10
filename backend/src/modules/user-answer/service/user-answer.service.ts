import { UserQuiz } from './../entity/user-quiz.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAnswer } from '../entity/user-answer.entity';

@Injectable()
export class UserAnswerService {
  constructor(
    @InjectRepository(UserAnswer)
    private readonly userAnswer: Repository<UserAnswer>,
    @InjectRepository(UserQuiz)
    private readonly userQuiz: Repository<UserQuiz>,
  ) {}

  async save(userAnswer: Partial<UserAnswer>): Promise<UserAnswer> {
    try {
      return this.userAnswer.save(userAnswer);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async saveQuiz(userQuiz: Partial<UserQuiz>): Promise<UserQuiz> {
    try {
      return this.userQuiz.save(userQuiz);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserAnswerQuiz(quizId: number, userId: string) {
    try {
      return this.userQuiz.findOne({
        where: {
          userId,
          quizId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserAnswerByQuestionId(questionId: number, studentId: string) {
    try {
      let query = `
      SELECT a.id
      FROM user_answers ua
      JOIN answers a
      ON a.id = ua.answerId
      WHERE a.questionId = ? and ua.userId = ?
      `;
      let answerIds = (
        (await this.userAnswer.query(query, [questionId, studentId])) as {
          id: number;
        }[]
      ).map((item) => item.id);
      return answerIds;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserAnswerByQuizId(quizId: number, studentId: string) {
    try {
      let query = `
      SELECT a.id
      FROM user_answers ua
      JOIN answers a
      ON a.id = ua.answerId
      JOIN questions qu
      ON qu.id = a.questionId
      WHERE qu.quizId = ? and ua.userId = ?
      `;
      let answerIds = (
        (await this.userAnswer.query(query, [quizId, studentId])) as {
          id: number;
        }[]
      ).map((item) => item.id);
      return answerIds;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(id: number): Promise<UserAnswer> {
    try {
      return this.userAnswer.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async existAnswer(id: number): Promise<UserAnswer> {
    let existAnswer = await this.findOneById(id);
    if (!existAnswer) {
      throw new NotFoundException('Not found Answer');
    }
    return existAnswer;
  }
}
