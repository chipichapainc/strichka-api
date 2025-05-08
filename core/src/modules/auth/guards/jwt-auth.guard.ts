import { Injectable, ExecutionContext, UnauthorizedException, CanActivate, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IJwtUserPayload } from '../types/jwt.token.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);

    constructor(private readonly authService: AuthService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    private async validateRequest(request: any): Promise<boolean> {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer') {
            throw new UnauthorizedException('Invalid authentication type, Bearer expected');
        }

        if (!token) {
            throw new UnauthorizedException('JWT token missing');
        }

        try {
            const { payload } = await this.authService.verifyToken(token);

            // Attach user payload to request for later use
            request.jwtPayload = payload;

            return true;
        } catch (error) {
            this.logger.error(error, {
                headers: request.headers,
                method: request.method,
                url: request.url,
                httpVersion: request.httpVersion,
                body: request.body,
                cookies: request.cookies,
                path: request.path,
                protocol: request.protocol,
                query: request.query,
                hostname: request.hostname,
                ip: request.ip,
                originalUrl: request.originalUrl,
                params: request.params,
            });
            if (process.env.NODE_ENV === 'production') {
                throw new UnauthorizedException();
            } else {
                throw error;
            }
        }
    }
} 