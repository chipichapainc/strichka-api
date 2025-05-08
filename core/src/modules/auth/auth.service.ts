import { Injectable } from '@nestjs/common';
import { IAuthService } from './types/auth.service.interface';
import { IJwtToken, IJwtUserPayload } from './types/jwt.token.interface';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { randomUUID } from 'node:crypto';
import { JwtTokenAccessKeyBuilder } from './builders/jwt-token-access-builder/jwt-token-access-key.builder';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService,
    ) { }

    async generateToken(payload: IJwtUserPayload): Promise<string> {
        // Generate unique token id
        let tokenId: string;
        let tokenKey: string;
        do {
            tokenId = randomUUID();
            tokenKey = JwtTokenAccessKeyBuilder.forId(tokenId).build();
        } while (
            await this.redisService.get(tokenKey)
        );

        const token = this.jwtService.sign(
            payload,
            {
                jwtid: tokenId,
            }
        );

        const tokenPayload = this.decodeToken(token);

        await this.redisService.set(tokenKey, token, tokenPayload.payload.exp);
        return token;
    }

    decodeToken(token: string): IJwtToken {
        return this.jwtService.decode<IJwtToken>(token, { complete: true, json: true });
    }

    async verifyToken(token: string): Promise<IJwtUserPayload> {
        return this.jwtService.verify<IJwtUserPayload>(token);
    }

    async deleteToken(token: string): Promise<string> {
        const tokenPayload = this.decodeToken(token);
        await this.redisService.del(
            JwtTokenAccessKeyBuilder.forToken(tokenPayload).build()
        );
        return tokenPayload.payload.jti;
    }
} 