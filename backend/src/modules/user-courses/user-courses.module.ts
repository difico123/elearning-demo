import { FavoriteModule } from './../favorite/favorite.module';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { UserCourseController } from './user-courses.controller';
import { UserCourseService } from './service/user-course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCourse } from './entity/user-course.entity';
import { CategoryModule } from '../category/category.module';
import { CourseModule } from '../course/course.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { RedisCacheModule } from '../cache/redis-cache.module';
import { RedisCacheService } from '../cache/redis-cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCourse]),
    CategoryModule,
    CourseModule,
    UserModule,
    AuthModule,
    NotificationModule,
    RedisCacheModule,
    FavoriteModule,
  ],
  controllers: [UserCourseController],
  providers: [UserCourseService, RedisCacheService],
  exports: [UserCourseService],
})
export class UserCourseModule {}
