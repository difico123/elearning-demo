import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/common/helpers/api.response';
import { InstructorDto } from 'src/modules/user/dto/user';
import { Course } from '../entity/course.entity';

export class CourseCreateDto {
  @ApiProperty({
    description: 'The price of course',
    minimum: 0,
    default: 0,
  })
  price: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  startCourseTime: string;

  @ApiProperty()
  endCourseTime: string;
}

export interface CourseDto {
  id: number;
  categoryId: number;
  instructorId: string;
  description: string;
  name: string;
  isPublished: boolean;
  price: number;
  startCourseTime: Date;
  endCourseTime: Date;
  image: string;
  created_at: Date;
  updated_at: Date;
}

export class CategoryDto {
  @ApiProperty()
  categoryId: number;
}
export interface CourseQueryDto {
  page: number;
  keyword: string;
  rating: string;
  pageSize: number;
  categoryId: number;
  instructorIds: string;
}
export interface CourseSearchQueryDto {
  page: number;
  keyword: string;
  pageSize: number;
  fields: string;
  rating?: string;
  categoryId?: number;
}
export class CourseDto {
  @ApiProperty()
  id: number;
}
export class CourseListResponse extends CommonListResponse<CourseDto> {}

export class InstructorListReponse extends CommonListResponse<InstructorDto> {}

export interface CourseSearch {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  image: string;
  description: string;
  instructorName: string;
  avgRating: number | null;
  studentTotal: string;
  startCourse: Date;
  endCourse: Date;
}

export interface instructorCourseDetailDto extends Course {
  email: string;
  username: string;
  address: string;
  phone: string;
  avatar: string;
  avgRating: string;
  studentTotal: string;
}

export type adminInstructorCourse = Course & {
  instructorName: string;
  email: string;
  address: string;
  phone: string;
  avatar: string;
};
