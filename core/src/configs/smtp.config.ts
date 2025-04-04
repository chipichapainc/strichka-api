import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

export enum SMTPProviders {
    BREVO = "brevo"
}

export class SmtpEnvConfig {
    @Expose()
    @IsNotEmpty()
    @IsEnum([
        SMTPProviders.BREVO
    ])
    readonly SMTP_PROVIDER: SMTPProviders = SMTPProviders.BREVO

    @Expose()
    @ValidateIf(
        (obj: SmtpEnvConfig) => [SMTPProviders.BREVO]
            .includes(obj.SMTP_PROVIDER)
    )
    @IsNotEmpty()
    @IsString()
    readonly SMTP_API_KEY: string
}