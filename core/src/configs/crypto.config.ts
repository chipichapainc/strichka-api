import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CryptoEnvConfig {
    @Expose()
    @IsNotEmpty()
    @IsString()
    readonly TICKET_CODE_HASH_SECRET: string
}