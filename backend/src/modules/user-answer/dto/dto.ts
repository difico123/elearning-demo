export interface QAParam {
  courseId: number;
  quizId: number;
}

export interface AnswerQuizBody {
  answers: UserAnswer[];
}

export interface UserAnswer {
  questionId: number;
  answerIds?: number[]; // For multiple/single choice
  answerText?: string; // For short answer
}
