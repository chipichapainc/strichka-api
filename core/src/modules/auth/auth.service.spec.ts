import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { IJwtUserPayload } from './types/jwt.token.interface';
import { RedisService } from '../redis/redis.service';
import { JwtTokenAccessKeyBuilder } from './builders/jwt-token-access-builder/jwt-token-access-key.builder';

jest.mock('node:crypto', () => ({
    randomUUID: jest.fn(() => 'test-uuid')
}));

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;
    let redisService: RedisService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        verifyAsync: jest.fn(),
                        decode: jest.fn(),
                    },
                },
                {
                    provide: RedisService,
                    useValue: {
                        set: jest.fn(),
                        get: jest.fn(),
                        del: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        redisService = module.get<RedisService>(RedisService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateToken', () => {
        it('should generate a JWT token with unique ID and store in Redis', async () => {
            const payload: IJwtUserPayload = { id: 'user123' };
            const expectedToken = 'mock.jwt.token';
            const tokenKey = JwtTokenAccessKeyBuilder.forId('test-uuid').build();
            const decodedToken = {
                header: { alg: 'HS256', typ: 'JWT' },
                payload: { id: 'user123', jti: 'test-uuid', exp: 3600, iat: 1000 },
                signature: 'signature'
            };

            (redisService.get as jest.Mock).mockResolvedValue(null);
            (jwtService.sign as jest.Mock).mockReturnValue(expectedToken);
            (jwtService.decode as jest.Mock).mockReturnValue(decodedToken);

            const token = await service.generateToken(payload);

            expect(token).toBe(expectedToken);
            expect(jwtService.sign).toHaveBeenCalledWith(payload, { jwtid: 'test-uuid' });
            expect(redisService.set).toHaveBeenCalledWith(
                tokenKey,
                expectedToken,
                { expiresAt: decodedToken.payload.exp + 1 }
            );
        });

        it('should retry if token ID already exists in Redis', async () => {
            const payload: IJwtUserPayload = { id: 'user123' };
            const expectedToken = 'mock.jwt.token';
            const decodedToken = {
                header: { alg: 'HS256', typ: 'JWT' },
                payload: { id: 'user123', jti: 'test-uuid', exp: 3600, iat: 1000 },
                signature: 'signature'
            };

            // First attempt finds existing token, second attempt succeeds
            (redisService.get as jest.Mock)
                .mockResolvedValueOnce('existing-token')
                .mockResolvedValueOnce(null);
            (jwtService.sign as jest.Mock).mockReturnValue(expectedToken);
            (jwtService.decode as jest.Mock).mockReturnValue(decodedToken);

            const token = await service.generateToken(payload);

            expect(token).toBe(expectedToken);
            expect(redisService.get).toHaveBeenCalledTimes(2);
        });
    });

    describe('decodeToken', () => {
        it('should decode a JWT token', () => {
            const token = 'valid.jwt.token';
            const expectedDecodedToken = {
                header: { alg: 'HS256', typ: 'JWT' },
                payload: { id: 'user123', jti: 'token-id', exp: 3600, iat: 1000 },
                signature: 'signature'
            };

            (jwtService.decode as jest.Mock).mockReturnValue(expectedDecodedToken);

            const decodedToken = service.decodeToken(token);

            expect(decodedToken).toEqual(expectedDecodedToken);
            expect(jwtService.decode).toHaveBeenCalledWith(token, {
                complete: true,
                json: true
            });
        });
    });

    describe('verifyToken', () => {
        it('should verify and return the payload from a valid token', async () => {
            const token = 'valid.jwt.token';
            const expectedPayload = {
                header: { alg: 'HS256', typ: 'JWT' },
                payload: { id: 'user123', jti: 'token-id', exp: 3600, iat: 1000 },
                signature: 'signature'
            };

            (jwtService.verifyAsync as jest.Mock).mockResolvedValue(expectedPayload);
            (redisService.get as jest.Mock).mockResolvedValue('token-data');

            const payload = await service.verifyToken(token);

            expect(payload).toEqual(expectedPayload);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
                complete: true,
            });
        });

        it('should throw an error for invalid token', async () => {
            const token = 'invalid.jwt.token';
            const error = new Error('Invalid token');

            (jwtService.verifyAsync as jest.Mock).mockRejectedValue(error);

            await expect(service.verifyToken(token)).rejects.toThrow(error);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
                complete: true,
            });
        });

        it('should throw an error for malformed token', async () => {
            const token = 'malformed.token';
            const error = new Error('Malformed token');

            (jwtService.verifyAsync as jest.Mock).mockRejectedValue(error);

            await expect(service.verifyToken(token)).rejects.toThrow(error);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
                complete: true,
            });
        });

        it('should throw an error for expired token', async () => {
            const token = 'expired.jwt.token';
            const error = new Error('Token expired');

            (jwtService.verifyAsync as jest.Mock).mockRejectedValue(error);

            await expect(service.verifyToken(token)).rejects.toThrow(error);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
                complete: true,
            });
        });
    });

    describe('deleteToken', () => {
        it('should delete a token from Redis and return its ID', async () => {
            const tokenId = 'token-id';
            const tokenKey = JwtTokenAccessKeyBuilder.forId(tokenId).build();

            (redisService.del as jest.Mock).mockResolvedValue(1);

            const result = await service.deleteToken(tokenId);

            expect(result).toBe(tokenId);
            expect(redisService.del).toHaveBeenCalledWith(tokenKey);
        });
    });
}); 