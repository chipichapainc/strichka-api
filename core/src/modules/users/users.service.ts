import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserCreateParams } from './types/user-create.params';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async findById(id: string, options?: FindOneOptions<User>): Promise<User | null> {
        const defaultOptions: FindOneOptions<User> = { 
            where: { id },
            ...options
        };
        return this.usersRepository.findOne(defaultOptions);
    }

    async findByEmail(email: string, options?: FindOneOptions<User>): Promise<User | null> {
        const defaultOptions: FindOneOptions<User> = { 
            where: { email },
            ...options
        };
        return this.usersRepository.findOne(defaultOptions);
    }


    async delete(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async create(params: IUserCreateParams): Promise<User> {
        const user = this.usersRepository.create(params);
        return this.usersRepository.save(user);
    }
} 