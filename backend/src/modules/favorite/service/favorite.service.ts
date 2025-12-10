import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Favorite } from '../entity/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favorite: Repository<Favorite>,
  ) {}

  async saveFavorite(userId: string, courseId: number): Promise<Favorite> {
    try {
      return this.favorite.save({
        userId,
        courseId,
        time: new Date(),
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(id: number): Promise<Favorite> {
    try {
      return this.favorite.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async existFavorite(userId: string, courseId: number): Promise<Favorite> {
    try {
      let existCourse = await this.favorite.findOne({
        where: {
          userId,
          courseId,
        },
      });

      return existCourse;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteFavorite(id: number): Promise<DeleteResult> {
    try {
      let deleteFavorite = await this.favorite.delete(id);
      return deleteFavorite;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
