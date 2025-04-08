import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UserPasswordModule } from '../user-password/user-password.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        UserPasswordModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { } 