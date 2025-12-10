import { UserCourse } from './../modules/user-courses/entity/user-course.entity';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { User } from 'src/modules/user/entity/user.entity';
import { Request } from 'express';
import { Role } from 'database/constant';
import { Socket } from 'socket.io';
import { Course } from 'src/modules/course/entity/course.entity';

export interface IUserJwt {
  role: Role;
  id: string;
  email: string;
  username: string;
}

export type IVerifyUserJwt = Pick<User, 'id' | 'email'>;

export type FilteredUser = Omit<
  User,
  'password' | 'resetToken' | 'expiredTokenTime'
>;

export interface UserResponse {
  user: FilteredUser;
}

export interface IError {
  success: boolean;
  code: HttpStatus;
  message: string;
  errors: any[];
}

export interface IUserReq<T> extends Request {
  user: T;
}

export type IUserJwtReq = IUserReq<IUserJwt>;

export interface IuserCourse extends IUserJwtReq {
  userCourse: UserCourse;
}

export interface IinstructorCourse extends IUserJwtReq {
  instructorCourse: Course;
}

export interface SearchServiceInterface<T> {
  insertIndex(bulkData: T): Promise<T>;

  updateIndex(updateData: T): Promise<T>;

  searchIndex(searchData: T): Promise<T>;

  deleteIndex(indexData: T): Promise<T>;

  deleteDocument(indexData: T): Promise<T>;
}

// service types
export type CreatePollFields = {
  topic: string;
  votesPerVoter: number;
  name: string;
};

export type JoinPollFields = {
  pollID: string;
  name: string;
};

export type RejoinPollFields = {
  pollID: string;
  userID: string;
  name: string;
};

export type AddParticipantFields = {
  pollID: string;
  userID: string;
  name: string;
};

export type AddNominationFields = {
  pollID: string;
  userID: string;
  text: string;
};

export type SubmitRankingsFields = {
  pollID: string;
  userID: string;
  rankings: string[];
};

// repository types
export type CreatePollData = {
  pollID: string;
  topic: string;
  votesPerVoter: number;
  userID: string;
};

export type AddParticipantData = {
  pollID: string;
  userID: string;
  name: string;
};

export type AddParticipantRankingsData = {
  pollID: string;
  userID: string;
  rankings: string[];
};

type AuthPayload = {
  userID: string;
  email: string;
  username: string;
  role: Role;
};

export interface ISocketUser extends AuthPayload {
  id: string;
  image?: string;
  count?: number;
}

export type SocketWithAuth = Socket & AuthPayload;
export type RequestWithAuth = Request & AuthPayload;
