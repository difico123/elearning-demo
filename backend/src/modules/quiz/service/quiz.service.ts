import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeStampToMysql } from 'src/common/ultils';
import { UserAnswerService } from 'src/modules/user-answer/service/user-answer.service';
import { UserQuizService } from 'src/modules/user-quiz/service/user-quiz.service';
import { TopicService } from 'src/modules/topics/service/topic.service';
import { getConnection, Repository } from 'typeorm';
import {
  BulkQuizInsertDto,
  BulkQuizResponseDto,
  BulkQuizUpdateDto,
  IQuestion,
} from '../dto/dto';
import { Answer } from '../entity/answer.entity';
import { Question } from '../entity/question.entity';
import { Quiz } from '../entity/quiz.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quiz: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly question: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answer: Repository<Answer>,
    private readonly userAnswer: UserAnswerService,
    private readonly userQuiz: UserQuizService,
    private readonly topicService: TopicService,
  ) {}

  async saveQuiz(quiz: Partial<Quiz>): Promise<Quiz> {
    try {
      return this.quiz.save(quiz);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async saveQuizBulk(quizBulk: BulkQuizInsertDto, topicId: number) {
    const { questionList, name, startTime, shown, duration } = quizBulk;

    // Validate quiz has at least 1 question
    if (!questionList || questionList.length === 0) {
      throw new BadRequestException('Quiz must have at least 1 question');
    }

    // Validate each question based on type
    for (let i = 0; i < questionList.length; i++) {
      const question = questionList[i];
      const questionType = question.type || 'multiple_choice';
      const questionName = question.name || `Question ${i + 1}`;
      const answerList = question.answerList || [];
      const correctAnswers = answerList.filter((a) => a.isCorrect);

      if (questionType === 'short_answer') {
        if (answerList.length !== 1) {
          throw new BadRequestException(
            `Question '${questionName}': Short answer questions must have exactly 1 answer`,
          );
        }
        if (!answerList[0].isCorrect) {
          throw new BadRequestException(
            `Question '${questionName}': Short answer question must have isCorrect set to true`,
          );
        }
      } else if (questionType === 'single_choice') {
        if (answerList.length < 2) {
          throw new BadRequestException(
            `Question '${questionName}': Single choice questions must have at least 2 answers`,
          );
        }
        if (correctAnswers.length !== 1) {
          throw new BadRequestException(
            `Question '${questionName}': Single choice questions must have exactly 1 correct answer`,
          );
        }
      } else {
        // Multiple choice: at least 1 answer, 0 or more correct answers allowed
        if (answerList.length === 0) {
          throw new BadRequestException(
            `Question '${questionName}': Each question must have at least 1 answer`,
          );
        }
        // No validation for correct answer count - 0 is allowed
      }
    }

    const topic = await this.topicService.existTopic(+topicId);
    let newQuiz = {
      topicId: +topicId,
      courseId: topic.courseId,
      name,
      shown,
      startTime: timeStampToMysql(startTime),
      duration: +duration,
    };

    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      let quiz: BulkQuizResponseDto = await this.quiz.save(newQuiz);
      let questions = await Promise.all([
        ...questionList?.map(async (questionItem) => {
          let { name, mark, type, answerList } = questionItem;

          let newQuestion = {
            quizId: quiz.id,
            name,
            mark: +mark,
            type: (type && ['multiple_choice', 'single_choice', 'short_answer'].includes(type)) 
              ? type 
              : 'multiple_choice',
          };
          let question: IQuestion = await this.question.save(newQuestion);
          if (!answerList?.length) {
            return question;
          }
          let answer = await Promise.all([
            ...answerList?.map(async (answerItem) => {
              const { isCorrect, content } = answerItem;

              let newAnswer = {
                isCorrect,
                content,
                questionId: question.id,
              };

              let answer = await this.answer.save(newAnswer);
              return answer;
            }),
          ]);

          question.answerList = answer;
          return question;
        }),
      ]);
      quiz.questionList = questions;
      await queryRunner.commitTransaction();
      return quiz;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getQuizsByTopicId(topicId: number) {
    try {
      return this.quiz.find({
        where: { topicId: topicId },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getBulks(topicId: number, studentId: string, courseId?: number) {
    try {
      if (courseId) {
        const topic = await this.topicService.existTopic(topicId);
        if (topic.courseId !== courseId) {
          throw new NotFoundException('topic not found in course');
        }
      }

      let show: { shown?: boolean } = {};
      show = !!studentId && {
        shown: true,
      };
      let quiz: BulkQuizResponseDto[] = await this.quiz.find({
        where: { topicId: topicId, ...(courseId ? { courseId } : {}), ...show },
      });
      quiz = await Promise.all(
        quiz.map(async (quizItem) => {
          let questions: IQuestion[] = await this.question.find({
            where: { quizId: quizItem.id },
          });
          let score;
          if (studentId) {
            score =
              (await this.userQuiz.getUserAnswerQuiz(studentId, quizItem.id))
                ?.markTotal || -1;
          }

          let questionList = await Promise.all([
            ...questions.map(async (questionItem) => {
              let answers = await this.answer.find({
                where: { questionId: questionItem.id },
              });
              let userAnswers: number[];
              if (studentId) {
                let ids = await this.userAnswer.getUserAnswerByQuestionId(
                  questionItem.id,
                  studentId,
                );
                userAnswers = ids;
              }
              return {
                ...questionItem,
                type: questionItem.type || 'multiple_choice',
                answerList: answers,
                userAnswers,
              };
            }),
          ]);

          quizItem.questionList = questionList;
          return { ...quizItem, score };
        }),
      );

      return quiz;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(id: number): Promise<Quiz> {
    try {
      return this.quiz.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateQuiz(quiz: BulkQuizInsertDto) {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    let { questionList, ...newQuiz } = quiz;

    try {
      await this.quiz.update(quiz.id, newQuiz);

      let question = await Promise.all(
        questionList.map((item) => {
          return this.updateQuestion(item);
        }),
      );
      await queryRunner.commitTransaction();
      return {
        questionList: question,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateQuestion(question: IQuestion) {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    let { answerList, ...newQuestion } = question;
    try {
      let questionId: number;
      if (question.id) {
        await this.question.update(question.id, newQuestion);
      } else {
        questionId = (await this.question.save(newQuestion)).id;
      }

      let answers = await Promise.all(
        answerList.map((item) => {
          return this.updateAnswer(item, questionId);
        }),
      );
      await queryRunner.commitTransaction();
      return {
        answerList: answers,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateAnswer(answer: Answer, questionId?: number) {
    try {
      if (!answer.id) {
        let newAnswer = {
          questionId,
          ...answer,
        };
        return this.answer.save(newAnswer);
      } else {
        return this.answer.update(answer.id, answer);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async existQuiz(id: number): Promise<Quiz> {
    let existQuiz = await this.findOneById(id);
    if (!existQuiz) {
      throw new NotFoundException('Not found Quiz');
    }
    return existQuiz;
  }

  async getAnswerList(quizId: number): Promise<
    {
      isCorrect: boolean;
      answerId: number;
      questionId: number;
      mark: number;
      type: string;
      content: string;
    }[]
  > {
    try {
      let query = `
      SELECT a.id as answerId, a.questionId, qu.mark, a.isCorrect, qu.type, a.content
      FROM answers a
      LEFT JOIN questions qu 
      ON qu.id = a.questionId
      LEFT JOIN quizes qi
      ON qi.id = qu.quizId
      WHERE qi.id = ?
      `;
      return this.quiz.query(query, [quizId]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneAnswerById(answerId: number): Promise<Answer | null> {
    try {
      return this.answer.findOne({ where: { id: answerId } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteAnswer(id: number) {
    try {
      return this.answer.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async deleteQuestion(id: number) {
    try {
      return this.question.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async deleteQuiz(id: number) {
    try {
      return this.quiz.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async rankCourse(courseId: number) {
    try {
      let query = `
      SELECT u.id, u.username, SUM(uq.markTotal) as totalMark
      FROM users u
      JOIN user_quizes uq
      ON u.id = uq.userId
      JOIN quizes qi
      ON qi.id = uq.quizId
      JOIN topics t
      ON t.id = qi.topicId
      WHERE t.courseId = ?
      GROUP BY u.id
      ORDER by totalMark desc, u.id desc limit 10;
      `;

      return this.quiz.query(query, [courseId]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateQuizOnly(quizId: number, quiz: Partial<Quiz>) {
    try {
      return this.quiz.update(quizId, quiz);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateQuestionOnly(questionId: number, question: Partial<Question>) {
    try {
      return this.question.update(questionId, question);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async updateAnswerOnly(answerId: number, answer: Partial<Answer>) {
    try {
      return this.answer.update(answerId, answer);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async saveAnswer(answer: Partial<Answer>) {
    try {
      return this.answer.save(answer);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async saveQuestion(question: Partial<Question>) {
    try {
      return this.question.save(question);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateQuizBulk(
    quizId: number,
    courseId: number,
    data: BulkQuizUpdateDto,
  ) {
    // Filter out invalid questions (empty name or empty answerList) before validation
    const validQuestions = (data.questions || []).filter(
      (q) =>
        q.name &&
        q.name.trim().length > 0 &&
        q.answerList &&
        q.answerList.length > 0,
    );

    // Validate quiz has at least 1 valid question
    if (validQuestions.length === 0) {
      throw new BadRequestException(
        'Quiz must have at least 1 question with at least 1 answer',
      );
    }

    // Validate each question based on type
    for (let i = 0; i < validQuestions.length; i++) {
      const question = validQuestions[i];
      const questionType = question.type || 'multiple_choice';
      const questionName = question.name || `Question ${i + 1}`;

      // Filter out answers with empty content
      question.answerList = question.answerList.filter(
        (a) => a.content && a.content.trim().length > 0,
      );
      
      // Check minimum answer count first
      if (questionType === 'short_answer') {
        if (question.answerList.length !== 1) {
          throw new BadRequestException(
            `Question '${questionName}': Short answer questions must have exactly 1 answer`,
          );
        }
        if (!question.answerList[0].isCorrect) {
          throw new BadRequestException(
            `Question '${questionName}': Short answer question must have isCorrect set to true`,
          );
        }
      } else if (questionType === 'single_choice') {
        if (question.answerList.length < 2) {
          throw new BadRequestException(
            `Question '${questionName}': Single choice questions must have at least 2 answers`,
          );
        }
        const correctAnswers = question.answerList.filter((a) => a.isCorrect);
        if (correctAnswers.length !== 1) {
          throw new BadRequestException(
            `Question '${questionName}': Single choice questions must have exactly 1 correct answer`,
          );
        }
      } else {
        // Multiple choice
        if (question.answerList.length === 0) {
          throw new BadRequestException(
            `Question '${questionName}': Each question must have at least 1 answer with content`,
          );
        }
        // Multiple choice can have 0 correct answers (no validation needed)
      }
    }

    // Use filtered questions
    data.questions = validQuestions;

    const quizExist = await this.existQuiz(quizId);
    const topic = await this.topicService.existTopic(quizExist.topicId);
    if (topic.courseId !== courseId) {
      throw new NotFoundException('Quiz does not belong to course');
    }

    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Update quiz meta
      const quizUpdate: Partial<Quiz> = {
        name: data.quiz.name,
        duration: +data.quiz.duration,
      };
      if (data.quiz.shown !== undefined) {
        quizUpdate.shown = data.quiz.shown;
      }
      await this.quiz.update(quizId, quizUpdate);

      // Delete removed answers first (to avoid foreign key constraints)
      if (data.deletedAnswerIds && data.deletedAnswerIds.length > 0) {
        await this.answer.delete(data.deletedAnswerIds);
      }

      // Delete removed questions (cascades to answers)
      if (data.deletedQuestionIds && data.deletedQuestionIds.length > 0) {
        await this.question.delete(data.deletedQuestionIds);
      }

      // Upsert questions and answers
      const updatedQuestions = await Promise.all(
        data.questions.map(async (questionData) => {
          let questionId: number;

          if (questionData.id) {
            // Update existing question
            await this.question.update(questionData.id, {
              name: questionData.name,
              mark: questionData.mark,
              type: (questionData.type && ['multiple_choice', 'single_choice', 'short_answer'].includes(questionData.type))
                ? questionData.type
                : 'multiple_choice',
            });
            questionId = questionData.id;
          } else {
            // Create new question
            const newQuestion = await this.question.save({
              quizId: quizId,
              name: questionData.name,
              mark: questionData.mark,
              type: (questionData.type && ['multiple_choice', 'single_choice', 'short_answer'].includes(questionData.type))
                ? questionData.type
                : 'multiple_choice',
            });
            questionId = newQuestion.id;
          }

          // Upsert answers for this question
          const updatedAnswers = await Promise.all(
            questionData.answerList.map(async (answerData) => {
              if (answerData.id) {
                // Update existing answer
                await this.answer.update(answerData.id, {
                  content: answerData.content,
                  isCorrect: answerData.isCorrect,
                });
                return { ...answerData, id: answerData.id };
              } else {
                // Create new answer
                const newAnswer = await this.answer.save({
                  questionId: questionId,
                  content: answerData.content,
                  isCorrect: answerData.isCorrect,
                });
                return { ...answerData, id: newAnswer.id };
              }
            }),
          );

          return {
            id: questionId,
            name: questionData.name,
            mark: questionData.mark,
            type: questionData.type || 'multiple_choice',
            quizId: quizId,
            answerList: updatedAnswers,
          };
        }),
      );

      await queryRunner.commitTransaction();

      // Fetch and return the complete updated quiz
      const updatedQuiz = await this.getBulks(
        quizExist.topicId,
        undefined,
        courseId,
      );
      return updatedQuiz.find((q) => q.id === quizId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
