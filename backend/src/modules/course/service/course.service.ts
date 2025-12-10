import {
  adminInstructorCourse,
  instructorCourseDetailDto,
} from './../dto/course.dto';
import { UserService } from 'src/modules/user/service/user.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entity/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Course } from '../entity/course.entity';
import { TableName } from 'database/constant';
import { CourseSearch } from '../dto/course.dto';
import { CourseStudentList } from 'src/modules/user-courses/dto/user-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly course: Repository<Course>,
    private readonly user: UserService,
  ) {}

  async saveCourse(course: Partial<Course>): Promise<Course> {
    try {
      return this.course.save(course);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateCourse(courseId: number, course: Partial<Course>) {
    try {
      return this.course.update(courseId, {
        ...course,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async instructorCourseDetail(
    courseId: number,
  ): Promise<instructorCourseDetailDto[]> {
    try {
      let query = `
        SELECT c.*, u.username, u.email, u.address, u.phone, u.avatar, ROUND(uc.avgRating, 1) as avgRating, uc.studentTotal
        FROM courses c
        LEFT JOIN ( 
          SELECT c.id, AVG(CAST(r.rating AS UNSIGNED)) as avgRating, COUNT(uc.id) as studentTotal FROM courses c
            LEFT JOIN user_courses uc on uc.courseId = c.id and uc.status <> 'expired' and uc.status <> 'reject'
            LEFT JOIN ratings r on r.userCourseId = uc.id 
            GROUP BY c.id
        ) as uc on uc.id = c.id
        JOIN users u ON c.instructorId = u.id
        WHERE c.id = ?
      `;
      return this.course.query(query, [courseId]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllCourses(): Promise<adminInstructorCourse[]> {
    try {
      let query = `
        SELECT c.*, u.username as instructorName, u.email, u.address, u.phone, u.avatar
        FROM courses c
        JOIN users u ON c.instructorId = u.id
      `;
      return this.course.query(query);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findInstructorCourse(
    instructorId: string,
    keyword?: string,
  ): Promise<Course[]> {
    try {
      let c = TableName.course;
      let queryKeywork = keyword ? `and ${c}.name LIKE "%${keyword}%"` : '';
      let query = `SELECT *
       FROM ${c}
       WHERE ${c}.instructorId = "${instructorId}" ${queryKeywork}`;

      return this.course.query(query);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(id: number): Promise<Course> {
    try {
      return this.course.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findCourseList(): Promise<[Course[], number]> {
    try {
      return this.course.findAndCount();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findCourses(
    categoryId?: number,
    text?: string,
    rating?: string,
    instructorIds?: string,
    isPublished?: boolean,
  ): Promise<CourseSearch[]> {
    try {
      let instructorIdArr = instructorIds?.split(',');

      let where =
        ((categoryId || text || rating || instructorIds) && 'where ') || '';

      let queryArr: string[] = [];

      categoryId && queryArr.push(`c.categoryId = ${categoryId}`);
      text && queryArr.push(`c.name like '%${text}%'`);
      rating && queryArr.push(`uc.avgRating > ${+rating - 0.01}`);
      instructorIds && queryArr.push(`c.instructorId in (?)`);
      isPublished && queryArr.push(`c.isPublished = ${isPublished ? 1 : 0}`);

      let queryWhereStr = queryArr.join(' and ');

      let query = `
      SELECT c.id, c.categoryId, c.name, c.image, c.price, c.description, u.username as instructorName, ROUND(uc.avgRating, 1) as avgRating, uc.studentTotal, c.startCourseTime as startCourse, c.endCourseTime as endCourse, c.isPublished
      FROM courses c
      JOIN users u on u.id = c.instructorId
      LEFT JOIN (
        SELECT c.id, AVG(CAST(r.rating AS UNSIGNED)) as avgRating, COUNT(uc.id) as studentTotal FROM courses c
          LEFT JOIN user_courses uc on uc.courseId = c.id and uc.status <> 'expired' and uc.status <> 'reject'
          LEFT JOIN ratings r on r.userCourseId = uc.id 
          GROUP BY c.id
      ) as uc on uc.id = c.id
      ${where} ${queryWhereStr}
      `;
      let result = await this.course.query(query, [instructorIdArr]);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getCourseInstrutor(id: string): Promise<User> {
    return this.user.findOneById(id);
  }

  async existCourse(id: number): Promise<Course> {
    let existCourse = await this.findOneById(id);
    if (!existCourse) {
      throw new NotFoundException('Not found course');
    }
    return existCourse;
  }

  async deleteCourse(id: number): Promise<DeleteResult> {
    try {
      return this.course.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
