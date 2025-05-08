import { FactoryProvider, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisEnvConfig } from '../../configs/redis.config';
import { redisEnvConfig } from '../../configs/configs';
import { IRedisService } from './types/redis.service.interface';

const RedisServiceProvider: FactoryProvider<IRedisService> = {
    provide: RedisService,
    useFactory: (configService: ConfigService<RedisEnvConfig>) => {
        return new RedisService(
            configService.getOrThrow("REDIS_HOST"),
            configService.getOrThrow("REDIS_PORT"),
            configService.getOrThrow("REDIS_PASSWORD"),
            configService.getOrThrow("REDIS_DB"),
            configService.get("REDIS_USER"),
            configService.get("REDIS_USER_PASSWORD")
        );
    },
    inject: [ConfigService],
};

@Module({
    imports: [ConfigModule.forFeature(redisEnvConfig)],
    providers: [RedisServiceProvider],
    exports: [RedisService],
})
export class RedisModule { } 