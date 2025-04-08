import { Body, Controller, Post, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPasswordService } from '../user-password/user-password.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly userPasswordService: UserPasswordService,
    ) { }

    @Post()
    async create(@Body() dto: CreateUserDto): Promise<User> {
        // Check if user already exists
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash the password
        const hashedPassword = await this.userPasswordService.hashPassword(dto.password);

        // Create the user with hashed password
        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            handle: dto.nickname,
            firstName: dto.firstName,
            lastName: dto.lastName,
        });

        return user;
    }
} 