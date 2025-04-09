import { Injectable } from '@nestjs/common';
import { PasswordHashingService } from '../crypto/password-hashing.service';

@Injectable()
export class UserPasswordService {
    constructor(
        private readonly passwordHashingService: PasswordHashingService,
    ) { }

    async hashPassword(value: string): Promise<string> {
        return this.passwordHashingService.hash(value);
    }

    async validatePassword(value: string, hashedValue: string): Promise<boolean> {
        return this.passwordHashingService.validate(value, hashedValue);
    }
} 