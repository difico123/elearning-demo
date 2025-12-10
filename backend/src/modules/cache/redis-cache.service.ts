import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DEFAULT_EXPIRE_CACHE } from 'src/common/constant';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    // Redis connection logging removed to reduce console noise
    // Connection is established automatically by NestJS cache manager
  }

  async set(key: string, value: string) {
    return this.cacheManager.set(key, value, { ttl: DEFAULT_EXPIRE_CACHE });
  }

  async get(key: string): Promise<string> {
    return this.cacheManager.get(key);
  }

  async resetAll(): Promise<void> {
    return this.cacheManager.reset();
  }

  async deleteByKey(key: string): Promise<unknown> {
    return this.cacheManager.del(key);
  }

  async setOrgetCache(key: string, cb: () => Promise<any>, expired?: number) {
    return new Promise<any>(async (resolve, reject) => {
      let data = await this.get(key);
      if (data) {
        resolve(JSON.parse(data));
      } else {
        let freshData = await cb();
        await this.cacheManager.set(
          key,
          JSON.stringify(freshData),
          expired || DEFAULT_EXPIRE_CACHE,
        );
        resolve(freshData);
      }
    });
  }
}
