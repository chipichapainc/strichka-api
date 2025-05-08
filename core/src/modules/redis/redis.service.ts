import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { IRedisService } from './types/redis.service.interface';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy, IRedisService {
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
            console.error('Redis connection error:', error);
        });

        await this.redisClient.connect();
    }

    async onModuleDestroy() {
        await this.redisClient.quit();
    }

    multi() {
        return this.redisClient.multi();
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.redisClient.set(key, value, { EX: ttl });
        } else {
            await this.redisClient.set(key, value);
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