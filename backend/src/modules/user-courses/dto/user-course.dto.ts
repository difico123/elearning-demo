import { CommonListResponse } from './../../../common/helpers/api.response';
import { ApiProperty } from '@nestjs/swagger';
import { Role, UserCourseStatus } from 'database/constant';

interface ItemCheckout {
  id: number;
  quantity: number;
}

export class CheckoutDto {
  @ApiProperty()
  items: ItemCheckout[];
}

export class CheckoutCourseDto {
  @ApiProperty()
  courseId: number;
}
export class JoinCourseDto {
  @ApiProperty()
  courseId: number;

  @ApiProperty()
  code: string;
}

export class CategoryDto {
  @ApiProperty()
  categoryId: number;
}

export class CourseDto {
  @ApiProperty()
  id: number;
}

export interface StudentCourseDto {
  startCourseTime: Date;
  startBlockTime: Date;
  status: UserCourseStatus;
  rating: number;
  description: string;
  courseId: number;
  name: string;
  instructorName: string;
  beginCourseTime: Date;
  endCourseTime: Date;
  price: number;
  image: string;
}

export class StudenCourseListResponse extends CommonListResponse<StudentCourseDto> {}

export interface CheckRegisterDto {
  status: UserCourseStatus | Role | 'guest';
}

export interface CourseStudentList {
  userId: string;
  avatar: string;
  username: string;
  email: string;
  status: string;
  startCourseTime: string | Date;
  score: string;
}

export interface StudentOutSideCourse {
  userId: string;
  avatar: string;
  username: string;
  email: string;
}

export interface QueryListDto {
  keyword: string;
  page: number;
  pageSize: number;
}
export class CourseStudenListResponse extends CommonListResponse<CourseStudentList> {}
export class OutSideCourseStudenListResponse extends CommonListResponse<StudentOutSideCourse> {}

export interface UserActionDto {
  type: UserCourseStatus | 'kick' | 'add';
  notificationId?: number;
}

export interface UserActionParam {
  courseId: number;
  studentId: string;
  notificationId?: number;
}
