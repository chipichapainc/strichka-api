import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UserPasswordModule } from '../user-password/user-password.module';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtEnvConfig } from 'src/configs/jwt.config';
import { RedisModule } from '../redis/redis.module';
@Module({
    imports: [
        UserPasswordModule,
        UsersModule,
        RedisModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<JwtEnvConfig>) => ({
                secret: configService.getOrThrow<string>('JWT_SECRET'),
                signOptions: {
                    algorithm: "HS256",
                    expiresIn: configService.getOrThrow<string>("JWT_EXPIRES_IN"),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard],
    exports: [AuthService, JwtAuthGuard],
})
export class AuthModule { }
