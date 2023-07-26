import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { User } from '../user.model';
import { Request } from 'express';
import { ExecutionContext } from '@nestjs/common';

describe('UsersController', () => {
    let controller: UsersController;

    const mockUserService = {
        findAll: jest.fn(() => expect.any(Array<User>)),
        findOneById: jest.fn((id: number) => {
            return {
                id: expect.any(Number),
                name: expect.any(String),
                email: expect.any(String),
                password: expect.any(String),
                isVerified: expect.any(Boolean),
                tokenVersion: expect.any(Number),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            } as User;
        }),
    };
    const reqMock = {
        userId: expect.any(Number),
    } as unknown as Request;

    const mockAuthGuard = {
        canActivate: jest.fn((context: ExecutionContext) => false),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService],
        })
            .overrideGuard(AuthGuard)
            .useValue(mockAuthGuard)
            .overrideProvider(UsersService)
            .useValue(mockUserService)
            .compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('users controller should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('GET(/users): find all users', () => {
        it('expect find all method of users service to be called', () => {
            controller.getUsers();
            expect(mockUserService.findAll).toHaveBeenCalled();
        });
    });

    describe('GET(/users/me): find current user', () => {
        it('expect find one by id of users service to be called with userId', () => {
            controller.getMe(reqMock);
            expect(mockUserService.findOneById).toHaveBeenCalledWith(
                reqMock.userId,
            );
        });
    });
});
