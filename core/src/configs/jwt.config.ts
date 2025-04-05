import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class JwtEnvConfig {
    @Expose()
    @IsNotEmpty()
    @IsString()
    readonly JWT_SECRET: string

    // expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d"
    @Expose()
    @IsOptional()
    @IsString()
    readonly JWT_EXPIRES_IN: string | number = "7d"
}