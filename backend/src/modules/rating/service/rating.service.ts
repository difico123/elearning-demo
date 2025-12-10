import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TableName } from 'database/constant';
import { DeleteResult, getManager, Repository } from 'typeorm';
import { Rating } from '../entity/rating.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async saveRating(rating: Partial<Rating>): Promise<Rating> {
    try {
      return this.ratingRepository.save(rating);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async upsertRating(rating: Partial<Rating>): Promise<Rating>  {
    try {
    let query = `INSERT INTO ${TableName.rating} (userCourseId, rating) VALUES (${rating.userCourseId}, '${rating.rating}') ON DUPLICATE KEY UPDATE rating = ${rating.rating}`
      return this.ratingRepository.query(query);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async deleteRating(id: number): Promise<DeleteResult> {
    try {
      return this.ratingRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findOneById(id: number): Promise<Rating> {
    try {
      return this.ratingRepository.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async existRating(id: number): Promise<Rating> {
    let existCourse = await this.findOneById(id);
    if (!existCourse) {
      throw new NotFoundException('Not found comment');
    }
    return existCourse;
  }
}
