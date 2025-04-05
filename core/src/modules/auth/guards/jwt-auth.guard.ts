import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IJwtUserPayload } from '../types/jwt.user.payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

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
      const payload: IJwtUserPayload = await this.authService.verifyToken(token);
      
      // Attach user payload to request for later use
      request.jwtPayload = payload;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }
} 