import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './db/typeorm-datasource';
import { CryptoModule } from './modules/crypto/crypto.module';
import { EmailsModule } from './modules/emails/emails.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(dbConfig),
        
        CryptoModule,
        EmailsModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule { }
