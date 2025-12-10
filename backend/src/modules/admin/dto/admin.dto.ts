import { Role } from 'database/constant';

export interface EditCourseDto {
  name: string;
  price: number;
  isPublished: boolean;
}

export interface courseParam {
  courseId: number;
}
export interface userParam {
  userId: string;
}

export interface EditUserDto {
  username: string;
  phone: string;
  address: string;
  password: string;
}

export interface UpdateRole {
  role: Role.instructor | Role.student;
}
