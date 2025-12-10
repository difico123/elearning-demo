import { Module } from '@nestjs/common';
import { UserQuizController } from './user-quiz.controller';
import { UserQuizService } from './service/user-quiz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQuiz } from './entity/user-quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserQuiz])],
  controllers: [UserQuizController],
  providers: [UserQuizService],
  exports: [UserQuizService],
})
export class UserQuizModule {}
