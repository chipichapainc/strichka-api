import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType, SetOptions } from 'redis';
import { IRedisService, TRedisSetOptions } from './types/redis.service.interface';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy, IRedisService {
    private readonly logger = new Logger(RedisService.name);
    private redisClient: RedisClientType;

    constructor(
        private host: string,
        private port: number,
        private password: string,
        private db: number = 0,
        private user?: string,
        private userPassword?: string
    ) { }

    async onModuleInit() {
        this.redisClient = createClient({
            url: `redis://${this.host}:${this.port}`,
            database: this.db,
            ...(this.user && this.userPassword
                ? { username: this.user, password: this.userPassword }
                : { password: this.password })
        });

        this.redisClient.on('error', (error) => {
            this.logger.error('Redis connection error:', error);
        });

        await this.redisClient.connect();
    }

    async onModuleDestroy() {
        await this.redisClient.quit();
    }

    private mapSetOptions(options: TRedisSetOptions): SetOptions {
        const setOptions: SetOptions = {};
        if ('existForMs' in options && options.existForMs) {
            setOptions.EX = options.existForMs;
        } else if ('expiresAt' in options && options.expiresAt) {
            setOptions.EXAT = (new Date(options.expiresAt)).getTime();
        }

        if ('ifNotExists' in options && options.ifNotExists) {
            setOptions.NX = true;
        } else if ('ifExists' in options && options.ifExists) {
            setOptions.XX = true;
        }

        if (options.returnOldValue) {
            setOptions.GET = true;
        }

        if (options.keepTtl) {
            setOptions.KEEPTTL = true;
        }
        return setOptions;
    }

    multi() {
        return this.redisClient.multi();
    }

    /**
     * Set a key-value pair in Redis with an optional expiration time in milliseconds
     * @param key - The key to set
     * @param value - The value to set
     * @param options - The options to set
     */
    async set(key: string, value: string, options?: TRedisSetOptions): Promise<void> {
        try {
            await this.redisClient.set(key, value, this.mapSetOptions(options));
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }

    async del(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.redisClient.exists(key);
        return result === 1;
    }
} 