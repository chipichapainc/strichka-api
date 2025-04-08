import { Injectable } from '@nestjs/common';
import { IAuthService } from './types/auth.service.interface';
import { IJwtUserPayload } from './types/jwt.user.payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async generateToken(payload: IJwtUserPayload): Promise<string> {
        return this.jwtService.sign(payload);
    }

    async verifyToken(token: string): Promise<IJwtUserPayload> {
        return this.jwtService.verify<IJwtUserPayload>(token);
    }
} 