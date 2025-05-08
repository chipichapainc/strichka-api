import { Body, Controller, Get, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IAuthController } from './types/auth.controller.interface';
import { IJwtUserPayload } from './types/jwt.token.interface';
import { UsersService } from '../users/users.service';
import { UserPasswordService } from '../user-password/user-password.service';

@Controller('auth')
export class AuthController implements IAuthController {
    constructor(
        private readonly userPasswordService: UserPasswordService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }

    @Post()
    async login(@Body() body: { email: string; password: string }): Promise<{ token: string }> {
        if (!body.email || !body.password) {
            throw new UnauthorizedException('Email and password are required');
        }

        // Find user by email
        const user = await this.usersService.findByEmail(
            body.email,
            {
                select: {
                    id: true,
                    password: true
                }
            }
        );
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Validate password
        const isPasswordValid = await this.userPasswordService.validatePassword(
            body.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Create JWT payload with user ID
        const payload: IJwtUserPayload = { id: user.id };

        // Generate token
        const token = await this.authService.generateToken(payload);

        return { token };
    }
} 