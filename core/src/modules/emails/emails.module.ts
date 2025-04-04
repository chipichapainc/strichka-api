import { FactoryProvider, Module } from '@nestjs/common';
import { BrevoEmailsService } from './brevo.emails.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmtpEnvConfig, SMTPProviders } from 'src/configs/smtp.config';
import { EmailsService } from './emails.service';
import { smtpEnvConfig } from 'src/configs/configs';

const EmailsServiceProvider: FactoryProvider<EmailsService> = {
  provide: EmailsService,
  useFactory: (config: ConfigService<SmtpEnvConfig>) => {
    switch(config.getOrThrow("SMTP_PROVIDER")) {
        case SMTPProviders.BREVO:
            return new BrevoEmailsService(config.getOrThrow("SMTP_API_KEY"));
        default:
            throw new Error("Invalid SMTP provider")
    }
  },
  inject: [ConfigService],
};

@Module({
    imports: [ConfigModule.forFeature(smtpEnvConfig)],
    controllers: [],
    providers: [EmailsServiceProvider],
    exports: [EmailsService],
})
export class EmailsModule { }
