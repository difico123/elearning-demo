import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../entity/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answer: Repository<Answer>,
  ) {}

  async save(quiz: Partial<Answer>): Promise<Answer> {
    try {
      return this.answer.save(quiz);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getQuizsByTopicId(topicId: number) {
    try {
      return this.answer.find({
        where: { topicId: topicId },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(id: number): Promise<Answer> {
    try {
      return this.answer.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async existAnswer(id: number): Promise<Answer> {
    let existAnswer = await this.findOneById(id);
    if (!existAnswer) {
      throw new NotFoundException('Not found Answer');
    }
    return existAnswer;
  }
}
