import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenPayload } from './types';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private configService: ConfigService<EnvironmentVariables>) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const req = context.switchToHttp().getRequest() as Request;
        const secret = this.configService.get('ACCESS_TOKEN_SECRET');

        // check if authorization header is present
        const authorization = req.headers['authorization'];
        if (!authorization) throw new UnauthorizedException();

        // verify the access token and get payload
        let payload: AccessTokenPayload | null = null;
        try {
            const token = authorization.split(' ')[1];
            payload = jwt.verify(token, secret) as AccessTokenPayload;
        } catch (error) {
            throw new UnauthorizedException();
        }

        // persist the user
        req.userId = payload.userId;

        return true;
    }
}
