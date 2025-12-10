import { UserQuiz } from '../entity/user-quiz.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserQuizService {
  constructor(
    @InjectRepository(UserQuiz)
    private readonly userQuiz: Repository<UserQuiz>,
  ) {}

  async save(userQuiz: Partial<UserQuiz>): Promise<UserQuiz> {
    try {
      return this.userQuiz.save(userQuiz);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteQuiz(userId: string, quizId: number) {
    try {
      return this.userQuiz.delete({
        userId,
        quizId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteQuizByQuizId(quizId: number) {
    try {
      return this.userQuiz.delete({
        quizId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(id: number): Promise<UserQuiz> {
    try {
      return this.userQuiz.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserAnswerQuiz(userId: string, quizId: number) {
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
  async existAnswer(id: number): Promise<UserQuiz> {
    let userQuiz = await this.findOneById(id);
    if (!userQuiz) {
      throw new NotFoundException('Not found Answer');
    }
    return userQuiz;
  }
}
