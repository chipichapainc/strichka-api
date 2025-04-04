import { Expose, Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DatabaseEnvConfig {
    @Expose()
    @IsNotEmpty()
    @IsString()
    readonly DATABASE_HOST: string

    @Expose()
    @IsOptional()
    @IsInt()
    readonly DATABASE_PORT: number = 5432

    @Expose()
    @IsOptional()
    @IsString()
    readonly DATABASE_USERNAME: string = "postgres"

    @Expose()
    @IsNotEmpty()
    @IsString()
    readonly DATABASE_PASSWORD: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    readonly DATABASE_NAME: string
}