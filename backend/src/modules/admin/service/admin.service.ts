import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCourse } from 'src/modules/user-courses/entity/user-course.entity';
import { UserCourseService } from 'src/modules/user-courses/service/user-course.service';
import { UserService } from 'src/modules/user/service/user.service';
import { CourseService } from 'src/modules/course/service/course.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usercourse: UserCourseService,
    private readonly user: UserService,
    private readonly courses: CourseService,
  ) {}

  getAllUsers() {
    try {
      return this.user.getUsers();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  getAllCourses() {
    try {
      return this.courses.getAllCourses();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
