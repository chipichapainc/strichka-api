import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../types/jwt.token.interface';

/**
 * Custom decorator to extract the JWT payload from the request
 * Use this in controller methods after applying JwtAuthGuard
 * 
 * Example:
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile(@JwtPayload() payload: IJwtUserPayload) {
 *   return payload;
 * }
 */
export const JwtPayload = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): IJwtPayload => {
        const request = ctx.switchToHttp().getRequest();
        return request.jwtPayload;
    },
); 