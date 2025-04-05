import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtEnvConfig } from 'src/configs/jwt.config';
import { CryptoModule } from '../crypto/crypto.module';
import { UserPasswordService } from './user-password.service';

@Module({
  imports: [
    CryptoModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<JwtEnvConfig>) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          algorithm: "HS256",
          expiresIn: configService.getOrThrow<string>("JWT_EXPIRES_IN"),
        },
      }),
    }),
  ],
  providers: [UserPasswordService],
  exports: [UserPasswordService, JwtModule],
})
export class UserPasswordModule {} 