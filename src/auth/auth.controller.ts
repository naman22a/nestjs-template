import {
    Body,
    Controller,
    InternalServerErrorException,
    Param,
    ParseUUIDPipe,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from '../shared';
import { AuthService, MailService, TokenService } from './services';
import { OkResponse } from '../common/interfaces';
import {
    ForgotPasswordDto,
    LoginDto,
    RegisterDto,
    ResetPasswordDto,
} from './dto';
import { redis } from '../common/redis';
import {
    CONFIRMATION_PREFIX,
    FORGOT_PASSWORD_PREFIX,
} from '../common/constants';
import { AccessTokenResponse } from './types';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private mailService: MailService,
        private authService: AuthService,
        private tokenService: TokenService,
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

    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AccessTokenResponse> {
        try {
            // validate user email and password
            const { user, errors } = await this.authService.validate(body);
            if (errors) return { accessToken: '', errors };

            // create and send access and refresh tokens
            const accessToken = this.tokenService.createAccessToken(user);
            const refreshToken = this.tokenService.createRefreshToken(user);
            this.tokenService.sendRefreshToken(res, refreshToken);

            return { accessToken };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response): OkResponse {
        this.tokenService.sendRefreshToken(res, '');
        return { ok: true };
    }

    @Post('forgot-password')
    async forgotPassword(
        @Body() { email }: ForgotPasswordDto,
    ): Promise<OkResponse> {
        try {
            // check if user exists
            const user = await this.usersService.findOneByEmail(email);
            if (!user) {
                return { ok: true };
            }

            // send reset password email
            const url = await this.mailService.createForgotPasswordUrl(user.id);
            await this.mailService.sendEmail(email, url);

            return { ok: true };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Post('reset-password/:token')
    async resetPassword(
        @Param('token', new ParseUUIDPipe({ version: '4' })) token: string,
        @Body() { password }: ResetPasswordDto,
    ): Promise<OkResponse> {
        // check if token or password is empty
        if (!token || !password) return { ok: false };

        try {
            // check if token exists in redis
            const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token);
            if (!userId) return { ok: false };

            // check if user exists for the userId
            const user = await this.usersService.findOneById(parseInt(userId));
            if (!user) return { ok: false };

            // update the password

            const x = await this.usersService.updatePassword(user.id, password);

            // check if any user's password was updated
            if (x.affected === 0) return { ok: false };

            // delete token from redis
            await redis.del(FORGOT_PASSWORD_PREFIX + token);

            return { ok: true };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
