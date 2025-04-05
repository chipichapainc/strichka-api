import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { IAuthService } from './types/auth.service.interface';
import { IJwtUserPayload } from './types/jwt.user.payload.interface';
import { PasswordHashingService } from '../crypto/password-hashing.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async hashPassword(value: string): Promise<string> {
    return this.passwordHashingService.hash(value);
  }

  async validatePassword(value: string, hashedValue: string): Promise<boolean> {
    return this.passwordHashingService.validate(value, hashedValue);
  }

  async generateToken(payload: IJwtUserPayload, signOptions?: JwtSignOptions): Promise<string> {
    return this.jwtService.sign(
        payload,
        signOptions
    );
  }

  async verifyToken(token: string): Promise<IJwtUserPayload> {
    return this.jwtService.verify<IJwtUserPayload>(token);
  }
} 