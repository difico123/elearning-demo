export interface QAParam {
  courseId: number;
  quizId: number;
}

export interface AnswerQuizBody {
  answers: UserAnswer[];
}

export interface UserAnswer {
  answerId: number;
}
