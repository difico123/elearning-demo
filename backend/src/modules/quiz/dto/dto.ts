import { CommonListResponse } from 'src/common/helpers/api.response';
import { Answer } from '../entity/answer.entity';
import { Question } from '../entity/question.entity';
import { Quiz } from '../entity/quiz.entity';

export interface CreateQuizDto {
  name: string;
  startTime: string;
  duration: string;
}

export interface BulkQuizInsertDto {
  id: number;
  name: string;
  startTime: string;
  duration: number;
  shown?: boolean;
  questionList: QuestionItem[];
}

export interface QuestionItem {
  id: number;
  quizId: number;
  name: string;
  mark: number;
  type?: string;
  answerList: AnswerItem[];
}

export interface AnswerItem {
  id: number;
  questionId: number;
  content: string;
  isCorrect: boolean;
}

export interface IQuizParam {
  topicId: string;
  courseId: string;
}

export interface IEditQuizParam {
  quizId: string;
  courseId: string;
}

export interface BulkQuizResponseDto extends Quiz {
  questionList?: IQuestion[];
}

export interface IQuestion extends Omit<Question, 'type'> {
  answerList?: Answer[];
  userAnswers?: number[];
  type?: string;
}

export type QuizListResponseDto = CommonListResponse<Quiz>;

export interface BulkQuizUpdateDto {
  quiz: {
    name: string;
    duration: string;
    shown?: boolean;
  };
  questions: Array<{
    id?: number; // undefined = new question
    name: string;
    mark: number;
    type?: string;
    answerList: Array<{
      id?: number; // undefined = new answer
      content: string;
      isCorrect: boolean;
    }>;
  }>;
  deletedQuestionIds?: number[];
  deletedAnswerIds?: number[];
}
