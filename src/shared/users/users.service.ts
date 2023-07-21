import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { CreateUserDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: EntityRepository<User>,
        private readonly em: EntityManager,
    ) {}

    async findAll() {
        return await this.usersRepository.findAll();
    }

    async findOneById(id: number) {
        return await this.usersRepository.findOne({ id });
    }

    async findOneByEmail(email: string) {
        return await this.usersRepository.findOne({ email });
    }

    async create(data: CreateUserDto) {
        const { password, ...rest } = data;
        const hashedPassword = await argon2.hash(password);
        const user = this.usersRepository.create({
            ...rest,
            password: hashedPassword,
        });
        await this.em.persistAndFlush(user);
        return user;
    }

    async verify(id: number) {
        const affected = await this.usersRepository.nativeUpdate(
            { id },
            { isVerified: true },
        );
        return { affected };
    }

    async updatePassword(id: number, password: string) {
        const hashedPassword = await argon2.hash(password);
        const affected = await this.usersRepository.nativeUpdate(
            { id },
            { password: hashedPassword },
        );
        return { affected };
    }

    async incrementTokenVersion(id: number) {
        const user = this.usersRepository.getReference(id);
        user.tokenVersion += 1;
        this.em.persistAndFlush(user);
    }
}
