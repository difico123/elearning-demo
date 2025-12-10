export enum TableName {
  category = 'categories',
  user = 'users',
  course = 'courses',
  userCourse = 'user_courses',
  notification = 'notifications',
  topic = 'topics',
  comment = 'comments',
  rating = 'ratings',
  quiz = 'quizes',
  question = 'questions',
  answer = 'answers',
  userAnswer = 'user_answers',
  favorite = 'favorites',
  userQuiz = 'user_quizes',
}

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
