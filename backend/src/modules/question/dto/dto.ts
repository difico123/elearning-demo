import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/common/helpers/api.response';
import { Question } from '../entity/question.entity';

export interface IQuestionItem {
  name: string;
  mark: string;
  answerList: IAnswerItem[];
}

export interface IAnswerItem {
  content: string;
  isCorrect: boolean;
}

export interface QuizListResponseDto extends CommonListResponse<Question> {}
