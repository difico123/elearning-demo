import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './service/question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entity/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
