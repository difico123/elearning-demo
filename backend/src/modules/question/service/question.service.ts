import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entity/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly question: Repository<Question>,
  ) {}

  async save(question: Partial<Question>): Promise<Question> {
    try {
      return this.question.save(question);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getQuizsByTopicId(topicId: number) {
    try {
      return this.question.find({
        where: { topicId: topicId },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(id: number): Promise<Question> {
    try {
      return this.question.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async existQuiz(id: number): Promise<Question> {
    let existQuiz = await this.findOneById(id);
    if (!existQuiz) {
      throw new NotFoundException('Not found Quiz');
    }
    return existQuiz;
  }
}
