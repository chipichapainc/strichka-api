import { Module } from '@nestjs/common';
import { CryptoModule } from '../crypto/crypto.module';
import { UserPasswordService } from './user-password.service';

@Module({
  imports: [
    CryptoModule,
  ],
  providers: [UserPasswordService],
  exports: [UserPasswordService],
})
export class UserPasswordModule {} 