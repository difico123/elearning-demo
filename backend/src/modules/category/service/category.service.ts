import { CourseCategoryResponse } from './../dto/api-response.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { CategoryListResponse } from 'src/modules/category/dto/api-response.dto';
import {
  DEFAULT_ORDER_DIRECTION,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from 'src/common/constant';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findOneById(id: number) {
    try {
      return this.categoryRepository.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findCourseCategories(): Promise<CourseCategoryResponse> {
    try {
      let query = `
      SELECT ca.id, ca.name, ca.image, ROUND(AVG(filters.rating),1) as avgRating, COUNT(c.id) as courseTotal ,SUM(filters.studentTotal) as studentTotal
      FROM categories ca
      LEFT JOIN courses c on c.categoryId = ca.id
      LEFT JOIN (
        SELECT c.id, AVG(CAST(r.rating AS UNSIGNED)) as rating, COUNT(uc.id) as studentTotal FROM courses c
          LEFT JOIN user_courses uc on uc.courseId = c.id and uc.status <> 'expired' and uc.status <> 'reject'
          LEFT JOIN ratings r on r.userCourseId = uc.id
          GROUP BY c.id
      ) as filters on filters.id = c.id
      GROUP BY ca.id
      `;
      let result = await this.categoryRepository.query(query);
      return {
        items: result,
        totalItems: result?.length,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findAll(query): Promise<CategoryListResponse> {
    const page = query.page || DEFAULT_PAGE;
    const limit = query.limit || DEFAULT_LIMIT;
    const orderBy = query.orderBy || DEFAULT_ORDER_DIRECTION;

    const [items, totalItems] = await this.categoryRepository.findAndCount({
      order: {
        id: orderBy,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      totalItems,
    };
  }
}
