import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHashingService } from '../crypto/password-hashing.service';
import { IJwtUserPayload } from '../auth/types/jwt.user.payload.interface';

@Injectable()
export class UserPasswordService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly passwordHashingService: PasswordHashingService,
    ) { }

    async hashPassword(value: string): Promise<string> {
        return this.passwordHashingService.hash(value);
    }

    async validatePassword(value: string, hashedValue: string): Promise<boolean> {
        return this.passwordHashingService.validate(value, hashedValue);
    }
} 