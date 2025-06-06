import { Body, Controller, Post, ConflictException, Get, Param, NotFoundException, UseGuards, ForbiddenException, InternalServerErrorException, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPasswordService } from '../user-password/user-password.service';
import { User } from './entities/user.entity';
import { AccessService } from '../auth/access.service';
import { AccessKeyBuilder } from '../auth/builders/access-builder/access-key-builder';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/decorators/jwt-payload.decorator';
import { IJwtUserPayload } from '../auth/types/jwt.token.interface';
import { Permissions } from '../auth/types/permission.types';

@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(
        private readonly accessService: AccessService,
        private readonly usersService: UsersService,
        private readonly userPasswordService: UserPasswordService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(
        @Param('id') id: string,
        @JwtPayload() jwtPayload: IJwtUserPayload
    ): Promise<User> {
        const hasAccess = await this.accessService.verifyAnyAccess(
            AccessKeyBuilder.forUser(jwtPayload.id)
                .to("users", id)
                .buildAll(),
            Permissions.READ
        );

        if (!hasAccess)
            throw new ForbiddenException('You do not have permission to access this resource');

        const user = await this.usersService.findById(id);
        if (!user)
            throw new NotFoundException('User not found');

        return user;
    }

    @Post()
    async create(@Body() dto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser)
            throw new ConflictException('User with this email already exists');

        const hashedPassword = await this.userPasswordService.hashPassword(dto.password);

        let user: User;
        try {
            user = await this.usersService.create({
                email: dto.email,
                password: hashedPassword,
                handle: dto.nickname,
                firstName: dto.firstName,
                lastName: dto.lastName,
            });

            await this.accessService.grantAccess(
                AccessKeyBuilder.forUser(user.id)
                    .to("users", user.id)
                    .build(),
                Permissions.READ_WRITE
            );
        } catch (error) {
            if (user)
                await this.usersService.delete(user.id);
            this.logger.error(error);
            throw new InternalServerErrorException('Failed to create user');
        }

        return user;
    }
} 