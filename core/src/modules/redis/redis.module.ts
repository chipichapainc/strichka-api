import { FactoryProvider, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisEnvConfig } from '../../configs/redis.config';
import { redisEnvConfig } from '../../configs/configs';
import { IRedisService } from './types/redis.service.interface';

const RedisServiceProvider: FactoryProvider<IRedisService> = {
    provide: RedisService,
    useFactory: (configService: ConfigService) => {
        const config = configService.get<RedisEnvConfig>('redis');
        return new RedisService(
            config.REDIS_HOST,
            config.REDIS_PORT,
            config.REDIS_PASSWORD,
            config.REDIS_DB
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