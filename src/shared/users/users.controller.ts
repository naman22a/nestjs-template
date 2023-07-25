import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { AuthGuard } from '../../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async getUsers() {
        return await this.usersService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get('me')
    async getMe(@Req() req: Request) {
        const userId = req.userId;
        return await this.usersService.findOneById(userId);
    }
}
