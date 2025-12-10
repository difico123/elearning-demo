import { Module } from '@nestjs/common';
import { CommentController as RatingController } from './rating.controller';
import { RatingService } from './service/rating.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entity/rating.entity';
import { UserCourseModule } from '../user-courses/user-courses.module';
import { CourseModule } from '../course/course.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating]),
    UserCourseModule,
    CourseModule,
    UserModule,
  ],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
