import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { User } from '../user.model';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import * as argon2 from 'argon2';

describe('UsersService', () => {
    let service: UsersService;
    let usersRepository: EntityRepository<User>;
    let em: EntityManager;
    const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: EntityManager,
                    useFactory: jest.fn(() => ({
                        persistAndFlush: jest.fn(),
                    })),
                },
                {
                    provide: USER_REPOSITORY_TOKEN,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        nativeUpdate: jest.fn(),
                        getReference: jest.fn(),
                    },
                },
            ],
            exports: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);
        usersRepository = module.get<EntityRepository<User>>(
            USER_REPOSITORY_TOKEN,
        );
        em = module.get(EntityManager);
    });

    it('users service should be defined', () => {
        expect(service).toBeDefined();
    });

    it('users repository should be defined', () => {
        expect(usersRepository).toBeDefined();
    });

    describe('findAll method of users service', () => {
        beforeEach(async () => {
            await service.findAll();
        });
        it('should have called findAll method of users repository', () => {
            expect(usersRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('findOneById method of users service', () => {
        const userId = expect.any(Number);
        beforeEach(async () => {
            await service.findOneById(userId);
        });
        it('should have called findOne method of users repository with userId', () => {
            expect(usersRepository.findOne).toHaveBeenCalled();
            expect(usersRepository.findOne).toHaveBeenCalledWith({
                id: userId,
            });
        });
    });

    describe('findOneByEmail method of users service', () => {
        const email = expect.any(String);
        beforeEach(async () => {
            await service.findOneByEmail(email);
        });
        it('should have called findOne method of users repository with email', () => {
            expect(usersRepository.findOne).toHaveBeenCalled();
            expect(usersRepository.findOne).toHaveBeenCalledWith({ email });
        });
    });

    describe('create method of users service', () => {
        beforeEach(async () => {
            jest.spyOn(argon2, 'hash').mockReturnValue(
                new Promise((resolve) => {
                    resolve('hash123');
                }),
            );
            jest.spyOn(usersRepository, 'create').mockReturnValueOnce({
                id: expect.any(Number),
                name: 'test',
                email: 'test@gmail.com',
                password: 'hash123',
                isVerified: false,
                tokenVersion: 0,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

            await service.create({
                name: 'test',
                email: 'test@gmail.com',
                password: 'test123',
            });
        });

        it('should create a new user with hashed password', async () => {
            expect(argon2.hash).toHaveBeenCalledWith('test123');
            expect(await argon2.hash('test123')).toEqual('hash123');
        });

        it('should have called users repository create method', () => {
            expect(usersRepository.create).toHaveBeenCalledWith({
                name: 'test',
                email: 'test@gmail.com',
                password: 'hash123',
            });
        });

        it('should have called em persistAndFlush method', () => {
            expect(em.persistAndFlush).toHaveBeenCalled();
        });

        it('should have called em persistAndFlush method with user model', () => {
            expect(em.persistAndFlush).toHaveBeenCalledWith({
                id: expect.any(Number),
                name: 'test',
                email: 'test@gmail.com',
                password: 'hash123',
                isVerified: false,
                tokenVersion: 0,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });
    });

    describe('verify method of users service', () => {
        const id = expect.any(Number);
        let result: {
            affected: number;
        };

        beforeEach(async () => {
            result = await service.verify(id);
        });

        it('should have called users repository nativeUpdate', () => {
            expect(usersRepository.nativeUpdate).toHaveBeenCalled();
            expect(usersRepository.nativeUpdate).toHaveBeenCalledWith(
                { id },
                { isVerified: true },
            );
        });
    });

    describe('updatePassword method of users service', () => {
        const id = expect.any(Number);
        const password = expect.any(String);

        beforeEach(async () => {
            await service.updatePassword(id, password);
        });

        it('should have hashed password', async () => {
            const hashedPassword = await argon2.hash(password);
            expect(argon2.hash).toHaveBeenCalled();
            expect(argon2.hash).toHaveBeenCalledWith(password);
            expect(hashedPassword).toEqual('hash123');
        });

        it('should have called users repository nativeUpdate', async () => {
            jest.spyOn(argon2, 'hash').mockReturnValue(
                new Promise((resolve) => resolve('hash123')),
            );
            const hashedPassword = await argon2.hash(password);

            expect(usersRepository.nativeUpdate).toHaveBeenCalled();
            expect(usersRepository.nativeUpdate).toHaveBeenCalledWith(
                { id },
                { password: hashedPassword },
            );
        });
    });

    describe('incrementTokenVersion method of users service', () => {
        const id = expect.any(Number);

        beforeEach(() => {
            jest.spyOn(usersRepository, 'getReference').mockReturnValue({
                id,
                name: expect.any(String),
                email: expect.any(String),
                password: expect.any(String),
                isVerified: expect.any(Boolean),
                tokenVersion: expect.any(Number),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });

        it('should have called users repository getReference with id', async () => {
            await service.incrementTokenVersion(id);
            expect(usersRepository.getReference).toHaveBeenCalled();
            expect(usersRepository.getReference).toHaveBeenCalledWith(id);
        });

        it('should have called em with persistAndFlush', async () => {
            await service.incrementTokenVersion(id);
            expect(em.persistAndFlush).toHaveBeenCalled();
        });
    });
});
