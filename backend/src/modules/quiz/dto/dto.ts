import { ApiProperty } from '@nestjs/swagger';
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

export interface IQuestion extends Question {
  answerList?: Answer[];
  userAnswers?: number[];
}

export interface IQueryEditDto {
  type: 'quiz' | 'question' | 'answer' | 'addQuestion' | 'addAnswer';
  sourceId: number;
}

export interface IEditQuizDto {
  answer?: Answer;
  question?: IQuestion;
  quiz?: BulkQuizInsertDto;
}

export interface IUpdateQuizDto {
  answer?: Answer;
  question?: Question;
  quiz?: Quiz;
}

export interface QuizListResponseDto extends CommonListResponse<Quiz> {}
