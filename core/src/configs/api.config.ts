import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class ApiEnvConfig {
    @Expose()
    @IsNotEmpty()
    @IsString()
    readonly DOMAIN: string
}