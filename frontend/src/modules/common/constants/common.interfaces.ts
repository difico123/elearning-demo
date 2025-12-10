export enum Role {
    student = 'student',
    instructor = 'instructor',
    admin = 'admin',
    guest = 'guest',
    pending = 'pending',
}

export enum Provider {
    google = 'google',
    local = 'local',
}

export enum UserCourseStatus {
    pending = 'pending',
    accepted = 'accepted',
    reject = 'reject',
    expired = 'expired',
    commentBlocking = 'comment_blocking',
}

export enum NotificationType {
    studentInvitation = 'student_invitation',
    topicCreation = 'topic_createion',
    homework = 'homework',
    topicComment = 'topic_comment',
    courseComment = 'course_comment',
    rating = 'rating',
    quiz = 'quiz',
    studentJoinCourse = 'student_join_course',
    studentJoinCourseFree = 'student_join_course_free',
}

export enum CommentType {
    course = 'course',
    topic = 'topic',
}
export interface IInstructorData {
    id?: string;
    username?: string;
    email?: string;
    address?: string;
    phone?: string;
}

export interface INotificationData {
    id: number;
    userId: string;
    type: NotificationType;
    sourceId: string;
    parentId: number;
    isRead: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    avatar?: string;
}

export interface UserActionDto {
    type: UserCourseStatus | 'kick' | 'add';
}
