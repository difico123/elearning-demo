import { CacheModule, Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { REDIS_CACHE_OPTIONS } from 'src/infra/redis/redis.config';

@Module({
  imports: [
    CacheModule.register({
      ...REDIS_CACHE_OPTIONS,
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
