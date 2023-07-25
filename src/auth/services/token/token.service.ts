import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../../../shared';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../../config';
import { AccessTokenPayload, RefreshTokenPayload } from '../../types';
import { Response } from 'express';
import { COOKIE_NAME, __prod__ } from '../../../common/constants';

@Injectable()
export class TokenService {
    constructor(private configService: ConfigService<EnvironmentVariables>) {}

    createAccessToken(user: User) {
        const secret = this.configService.get('ACCESS_TOKEN_SECRET');
        return jwt.sign(
            { userId: user.id } satisfies AccessTokenPayload,
            secret,
            { expiresIn: '15m' },
        );
    }

    createRefreshToken(user: User) {
        const secret = this.configService.get('REFRESH_TOKEN_SECRET');
        return jwt.sign(
            {
                userId: user.id,
                tokenVersion: user.tokenVersion,
            } satisfies RefreshTokenPayload,
            secret,
            { expiresIn: '7d' },
        );
    }

    sendRefreshToken(res: Response, token: string) {
        const domain = this.configService.get('COOKIE_DOMAIN');
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: __prod__,
            domain: __prod__ ? domain : undefined,
        });
    }
}
