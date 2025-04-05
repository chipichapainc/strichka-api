import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { PasswordHashingService } from './password-hashing.service';

@Module({
    imports: [],
    controllers: [],
    providers: [EncryptionService, PasswordHashingService],
    exports: [EncryptionService, PasswordHashingService],
})
export class CryptoModule { }
