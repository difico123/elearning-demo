import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './service/question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entity/question.entity';

import { AnswerModule } from '../answer/answer.module';
import { CourseModule } from '../course/course.module';
import { UserCourseModule } from '../user-courses/user-courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    AnswerModule,
    CourseModule,
    UserCourseModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
