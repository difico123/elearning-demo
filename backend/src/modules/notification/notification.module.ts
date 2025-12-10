import { UserModule } from './../user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './service/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationCourse } from './entity/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationCourse]),
    forwardRef(() => UserModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
