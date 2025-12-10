import { UserAnswerModule } from './modules/user-answer/user-answer.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'typeorm';
import { DatabaseModule } from './common/database.module';
import { CourseModule } from './modules/course/course.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
// import { MailModule } from './modules/mail/mail.module'; // Temporarily disabled
import { CategoryModule } from './modules/category/category.module';
import { RedisCacheModule } from './modules/cache/redis-cache.module';
import { ConfigModule } from '@nestjs/config';
import { LocalFileModule } from './infra/local-file/local-file.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { UserCourseModule } from './modules/user-courses/user-courses.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PollModule } from './modules/poll/polls.module';
import { JWTModule } from './modules/jwt/jwt.module';
import { TopicModule } from './modules/topics/topic.module';
import { CommentModule } from './modules/comment/comment.module';
import { RatingModule } from './modules/rating/rating.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { AdminModule } from './modules/admin/admin.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuestionModule } from './modules/question/question.module';
import { AnswerModule } from './modules/answer/answer.module';

@Module({
  imports: [
    StripeModule.forRoot(process.env.STRIPE_API_KEY),
    UserCourseModule,
    ConfigModule,
    DatabaseModule,
    CategoryModule,
    UserModule,
    AuthModule,
    // MailModule, // Temporarily disabled
    CourseModule,
    LocalFileModule,
    RedisCacheModule,
    NotificationModule,
    JWTModule,
    PollModule,
    TopicModule,
    CommentModule,
    RatingModule,
    FavoriteModule,
    AdminModule,
    QuizModule,
    QuestionModule,
    AnswerModule,
    UserAnswerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
