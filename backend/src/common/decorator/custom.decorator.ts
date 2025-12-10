import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IinstructorCourse, IuserCourse, IUserJwtReq } from '../interfaces';

export const User = createParamDecorator((data, ctx: ExecutionContext) => {
  const request: IUserJwtReq = ctx.switchToHttp().getRequest();
  const user = request.user;
  return data ? user?.[data] : user;
});

export const Student = createParamDecorator((data, ctx: ExecutionContext) => {
  const request: IuserCourse = ctx.switchToHttp().getRequest();
  const student = request.userCourse;
  return data ? student?.[data] : student;
});

export const Instructor = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request: IinstructorCourse = ctx.switchToHttp().getRequest();
    const instructor = request.instructorCourse;
    return data ? instructor?.[data] : instructor;
  },
);
