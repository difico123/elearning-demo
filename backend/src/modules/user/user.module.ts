import { RedisCacheModule } from './../cache/redis-cache.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    RedisCacheModule,
    NotificationModule,
  ],
  providers: [UserService, ConfigService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
