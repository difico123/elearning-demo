import { UserCourseStatus } from './course.constants';
import { UserCourseStatus as UC } from '@/modules/common/constants/common.interfaces';
import { SystemRole } from '@/common/constants';
export interface ICourseData {
    id: number;
    categoryId: number;
    name: string;
    image: string;
    price: number;
    description: string;
    instructorName: string;
    avgRating: number | null;
    studentTotal: number;
    instructorId: string;
    isPublished?: boolean;
}

export interface ICourseListParams {
    page?: number;
    pageSize?: number;
    keyword?: string;
    rating?: string;
    categoryId?: number;
    instructorIds?: string;
    userId?: string;
}

export interface ICourseCreation {
    isPublished: boolean;
    name: string;
    description: string;
    price: number;
    file?: string;
}

export interface ICoursePreviewTopic {
    id?: number;
    name?: string;
    description?: string;
}

export interface ICoursePreviewData {
    topics?: Array<ICoursePreviewTopic>;
    course?: ICourseData;
}

export interface IUserCourseData {
    status?: UserCourseStatus;
    favorite?: boolean;
    instructorId?: string;
    rating?: string;
}

export interface IToggleCourseFavoriteResponse {
    favorite?: boolean;
}

export interface ICourseCheckoutResponse {
    url?: string;
}

export interface IStudentCourseData {
    id?: number;
    status?: UserCourseStatus;
    startCourseTime?: string;
    blockDuration?: string | null;
    rating?: string;
    courseId?: number;
    name?: string;
    instructorName: string;
    price: number;
    image: string;
    beginCourseTime: string;
    endCourseTime: string;
    startBlockTime: string;
}

export interface IStudentCourseShortData {
    userId: string;
    username: string;
    email: string;
    avatar: string;
    startCourseTime: string;
    status: UC;
    score: number;
}

export interface IOutsideStudentCourseData {
    userId: string;
    username: string;
    email: string;
    avatar: string;
}

export interface ITopicData {
    id?: number;
    courseId?: number;
    name?: string;
    description?: string;
    content?: string | HTMLElement;
    video?: string;
}

export interface IEditCourseQuery {
    name?: string;
    description?: string;
    content?: string;
}

export interface IQuiz {
    id?: number;
    topicId?: number;
    name?: string;
    shown?: boolean;
    startTime?: string;
    duration?: string;
}

export interface IQuestion {
    id?: number;
    quizId?: number;
    name?: string;
    mark?: number;
}

export interface IAnswer {
    id?: number;
    questionId?: number;
    content?: string;
    isCorrect?: boolean;
}

export interface IQuizDetail {
    id?: number;
    name?: string;
    shown?: boolean;
    isEdit?: boolean;
    topicId?: number;
    startTime?: string;
    duration?: string;
    score?: number;
    questionList?: Array<IQuestionDetail>;
}

export interface IQuestionDetail {
    quizId?: number;
    id?: number;
    name: string;
    mark: number;
    answerList?: Array<IAnswerDetail>;
    answerCorrectState?: Array<boolean>;
}

export interface IAnswerDetail {
    id?: number;
    questionId?: number;
    content: string;
    isCorrect: boolean;
    isShowInput?: boolean;
    isAnswer?: string;
}

export interface ICreateQuizParams {
    name: string;
    startTime: string;
    duration: string;
}

export interface IMessageDetail {
    id: number;
    userId: string;
    sourceId: number;
    type: string;
    comment: string;
    time: string;
    isBad: number;
    isBlock: number;
    username: string;
    email: string;
    role: SystemRole;
    avatar: string;
}

export interface IStudentRankData {
    id: string;
    username: string;
    totalMark: string;
}
