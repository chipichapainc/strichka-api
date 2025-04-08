import { IsNumber, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class RedisEnvConfig {
    @Expose()
    @IsString()
    @IsOptional()
    REDIS_HOST?: string = 'localhost';

    @Expose()
    @IsNumber()
    @IsOptional()
    REDIS_PORT?: number = 6379;

    @Expose()
    @IsString()
    @IsOptional()
    REDIS_PASSWORD?: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    REDIS_DB?: number = 0;
} 