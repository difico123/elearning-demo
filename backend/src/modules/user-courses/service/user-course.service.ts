import {
  CourseStudentList,
  StudentOutSideCourse,
} from './../dto/user-course.dto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCourseDto } from '../dto/user-course.dto';
import { UserCourse } from '../entity/user-course.entity';
import { Rating } from 'src/modules/rating/entity/rating.entity';

type UserRating = UserCourse & Rating;
@Injectable()
export class UserCourseService {
  constructor(
    @InjectRepository(UserCourse)
    private readonly usercourse: Repository<UserCourse>,
  ) {}

  async saveUserCourse(userCourse: Partial<UserCourse>): Promise<UserCourse> {
    try {
      return this.usercourse.save(userCourse);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async find(): Promise<UserCourse[]> {
    try {
      return this.usercourse.find();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUserCourse(id: number) {
    try {
      return this.usercourse.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateUserCourse(id: number, properties: Partial<UserCourse>) {
    try {
      let result = await this.usercourse.save({
        ...properties,
        id,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(id: number): Promise<UserCourse> {
    try {
      return this.usercourse.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getStudentList(courseId: number): Promise<CourseStudentList[]> {
    try {
      let query = `
      SELECT uc.userId, u.username, u.email, u.avatar, uc.startCourseTime, uc.status, uq.score
      FROM user_courses uc
      JOIN users u 
      ON u.id = uc.userId
      LEFT JOIN (
          SELECT uq.userId as id, SUM(uq.markTotal) as score
          FROM user_quizes uq
          JOIN quizes qi         
          ON qi.id = uq.quizId
          JOIN topics t         
          ON t.id = qi.topicId 
          WHERE t.courseId = ?
          GROUP BY uq.userId
      ) as uq
      ON uq.id = uc.userId
      WHERE uc.courseId = ? 
       `;

      return this.usercourse.query(query, [courseId, courseId]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findUserOutsideCourse(
    courseId: number,
  ): Promise<StudentOutSideCourse[]> {
    try {
      let query = `
    SELECT u.id as userId, u.avatar, u.username, u.email
    FROM users u
    WHERE u.id not in  
      ( SELECT uc.userId
      FROM user_courses uc
      WHERE uc.courseId = ? ) and u.role <> 'admin' and u.role <> 'instructor'
       `;

      return this.usercourse.query(query, [courseId]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findCoursesByUserId(userId: string): Promise<StudentCourseDto[]> {
    try {
      let query = `
      SELECT uc.id as usercourseId, uc.status, uc.startCourseTime, uc.blockDuration, r.rating, c.*
      FROM user_courses uc 
      LEFT JOIN (
          SELECT c.id, c.name as name, u.username as instructorName, c.description, c.price, c.image, c.startCourseTime as beginCourseTime, c.endCourseTime
          FROM courses c
          JOIN users u ON u.id = c.instructorId
      ) as c on c.id = uc.courseId
      LEFT JOIN ratings r on r.userCourseId = uc.id
      WHERE uc.userId = ? and uc.status <> "reject";
      `;
      return this.usercourse.query(query, [userId]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByUsercourse(
    userId: string,
    courseId: number,
  ): Promise<UserCourse> {
    try {
      return this.usercourse.findOne({
        where: {
          userId,
          courseId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findUserRating(
    userId: string,
    courseId: number,
  ): Promise<UserRating[]> {
    try {
      const query = `
      SELECT *
      FROM user_courses uc
      LEFT JOIN ratings r
      ON r.userCourseId = uc.id
      WHERE uc.userId = ? and uc.courseId = ?
      LIMIT 1
      `;
      return this.usercourse.query(query, [userId, courseId]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async existUserCourse(courseId: number, userId: string): Promise<UserCourse> {
    let existCourse = await this.findOneByUsercourse(userId, courseId);
    if (!existCourse) {
      throw new NotFoundException('Not found student in this course');
    }
    return existCourse;
  }
}
