import {
    Body,
    Controller,
    InternalServerErrorException,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
import { UsersService } from '../shared';
import { MailService } from './services';
import { OkResponse } from '../common/interfaces';
import { RegisterDto } from './dto';
import { redis } from '../common/redis';
import { CONFIRMATION_PREFIX } from '../common/constants';

@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private mailService: MailService,
    ) {}

    @Post('register')
    async register(@Body() body: RegisterDto): Promise<OkResponse> {
        const { email } = body;
        try {
            // check if user exists
            const userExists = await this.usersService.findOneByEmail(email);
            if (userExists) {
                return {
                    ok: false,
                    errors: [
                        { field: 'email', message: 'email already in use' },
                    ],
                };
            }

            // save user to database
            const user = await this.usersService.create(body);

            // send confirmation email
            const url = await this.mailService.createConfirmationUrl(user.id);
            await this.mailService.sendEmail(email, url);

            return { ok: true };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Post('confirm-email/:token')
    async confirmEmail(
        @Param('token', new ParseUUIDPipe({ version: '4' })) token: string,
    ): Promise<OkResponse> {
        if (!token) return { ok: false };
        try {
            // check if token exists in redis
            const userId = await redis.get(CONFIRMATION_PREFIX + token);
            if (!userId) return { ok: false };

            // check if user exists
            const user = await this.usersService.findOneById(parseInt(userId));

            // verify the user
            const x = await this.usersService.verify(user.id);

            // check if no user is updated
            if (x.affected === 0) return { ok: false };

            // delete token from redis
            await redis.del(CONFIRMATION_PREFIX + token);

            return { ok: true };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
