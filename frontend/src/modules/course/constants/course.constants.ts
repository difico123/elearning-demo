export const CourseListDisplayMode = {
    GRID: 'GRID',
    LIST: 'LIST',
};

export const StudentListMode = {
    INSIDE: 'INSIDE',
    OUTSIDE: 'OUTSIDE',
};

export const deleteType = {
    QUESTION: 'question',
    QUIZ: 'quiz',
    ANSWER: 'answer',
};

export const MAX_COURSE_GRID_ITEMS = 20;
export const MAX_COURSE_LIST_ITEMS = 16;
export const DEFAULT_SELECTED_PAGE = 1;
export const DEFAULT_STUDENT_COUNT_PER_PAGE = 10;

export enum UserCourseStatus {
    STUDENT = 'student',
    ADMIN = 'admin',
    INSTRUCTOR = 'instructor',
    GUEST = 'guest',
    ACCEPTED = 'accepted',
    REJECTED = 'reject',
    EXPIRED = 'expired',
    PENDING = 'pending',
    COMMENT_BLOCKED = 'comment_blocking',
}

export const SidebarMode = {
    EXPANDED: 'EXPANDED',
    COLLAPSED: 'COLLAPSED',
};

export const CourseArea = {
    COURSE: 'COURSE',
    QUIZ: 'QUIZ',
};
