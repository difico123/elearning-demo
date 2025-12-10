import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constant';
import { RedisModule } from 'src/redis.module';
import { RedisCacheModule } from '../cache/redis-cache.module';
import { JWTModule } from '../jwt/jwt.module';
import { PollGateway } from './poll.gateway';
import { PollService } from './poll.service';

@Module({
  imports: [
    RedisCacheModule,
    ConfigModule,
    JWTModule,
    RedisModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '1d',
        algorithm: 'HS384',
      },
      verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
  ],
  controllers: [],
  providers: [PollGateway, PollService],
  exports: [],
})
export class PollModule {}
