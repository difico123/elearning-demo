import { CommentType, NotificationType } from 'database/constant';
import { CommonListResponse } from 'src/common/helpers/api.response';

export interface NotificationDto {
  id: number;
  userId: string;
  type: NotificationType;
  sourceId: string;
  parentId: string;
  isRead: boolean;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}
export class NotificationListResponse extends CommonListResponse<NotificationDto> {}

export interface QueryNotificationDto {
  page: string;
  pageSize: string;
}

export interface CommentNotificationDto {
  commentType: CommentType;
  userId: string;
  courseOrTopicId: number;
  username: string;
  sourceUserId: string;
}

type PickKey<T, K extends keyof T> = Extract<keyof T, K>;
type Picked_KeysOfEnum = PickKey<
  typeof NotificationType,
  'studentJoinCourse' | 'studentJoinCourseFree'
>;

export interface StudentJoinCourseDto {
  instructorId: string;
  type: Picked_KeysOfEnum;
  studentId: string;
  courseId: number;
  studentName: string;
  courseName: string;
}

export interface InvitedStudentJoinCourseDto {
  instructorId: string;
  studentId: string;
  courseId: number;
  courseName: string;
  instructorName: string;
}
