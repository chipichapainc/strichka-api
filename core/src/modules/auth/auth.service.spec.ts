import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { IJwtUserPayload } from './types/jwt.user.payload.interface';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        verify: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateToken', () => {
        it('should generate a JWT token for a user payload', async () => {
            const payload: IJwtUserPayload = { id: 'user123' };
            const expectedToken = 'mock.jwt.token';

            (jwtService.sign as jest.Mock).mockReturnValue(expectedToken);

            const token = await service.generateToken(payload);

            expect(token).toBe(expectedToken);
            expect(jwtService.sign).toHaveBeenCalledWith(payload);
        });

        it('should handle empty payload', async () => {
            const payload: IJwtUserPayload = { id: '' };
            const expectedToken = 'mock.jwt.token';

            (jwtService.sign as jest.Mock).mockReturnValue(expectedToken);

            const token = await service.generateToken(payload);

            expect(token).toBe(expectedToken);
            expect(jwtService.sign).toHaveBeenCalledWith(payload);
        });
    });

    describe('verifyToken', () => {
        it('should verify and return the payload from a valid token', async () => {
            const token = 'valid.jwt.token';
            const expectedPayload: IJwtUserPayload = { id: 'user123' };

            (jwtService.verify as jest.Mock).mockReturnValue(expectedPayload);

            const payload = await service.verifyToken(token);

            expect(payload).toEqual(expectedPayload);
            expect(jwtService.verify).toHaveBeenCalledWith(token);
        });

        it('should throw an error for invalid token', async () => {
            const token = 'invalid.jwt.token';
            const error = new Error('Invalid token');

            (jwtService.verify as jest.Mock).mockImplementation(() => {
                throw error;
            });

            await expect(service.verifyToken(token)).rejects.toThrow(error);
            expect(jwtService.verify).toHaveBeenCalledWith(token);
        });

        it('should throw an error for malformed token', async () => {
            const token = 'malformed.token';
            const error = new Error('Malformed token');

            (jwtService.verify as jest.Mock).mockImplementation(() => {
                throw error;
            });

            await expect(service.verifyToken(token)).rejects.toThrow(error);
            expect(jwtService.verify).toHaveBeenCalledWith(token);
        });

        it('should throw an error for expired token', async () => {
            const token = 'expired.jwt.token';
            const error = new Error('Token expired');

            (jwtService.verify as jest.Mock).mockImplementation(() => {
                throw error;
            });

            await expect(service.verifyToken(token)).rejects.toThrow(error);
            expect(jwtService.verify).toHaveBeenCalledWith(token);
        });
    });
}); 