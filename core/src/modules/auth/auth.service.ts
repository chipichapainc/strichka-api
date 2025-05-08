import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from './types/auth.service.interface';
import { IJwtToken, IJwtUserPayload } from './types/jwt.token.interface';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { randomUUID } from 'node:crypto';
import { JwtTokenAccessKeyBuilder } from './builders/jwt-token-access-builder/jwt-token-access-key.builder';
import { dateDiffInSeconds } from 'src/common/helpers/date-diff.helper';
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
        
        await this.redisService.set(
            tokenKey,
            token,
            {
                // Add 1 second to the expiration time to avoid early expiration
                // because jwt store expiration date in seconds 
                // and redis store expiration date in milliseconds
                expiresAt: tokenPayload.payload.exp + 1
            }
        );
        return token;
    }

    decodeToken(token: string): IJwtToken {
        return this.jwtService.decode<IJwtToken>(token, { complete: true, json: true });
    }

    async verifyToken(token: string): Promise<IJwtToken> {
        const tokenData = await this.jwtService.verifyAsync<IJwtToken>(
            token,
            {
                complete: true,
            }
        );
        
        const tokenRecord = await this.redisService.get(
            JwtTokenAccessKeyBuilder.forToken(tokenData).build()
        );

        if (!tokenRecord)
            throw new UnauthorizedException('JWT token invalidated');

        return tokenData;
    }

    async deleteToken(id: string): Promise<string> {
        await this.redisService.del(
            JwtTokenAccessKeyBuilder.forId(id).build()
        );
        return id;
    }
} 