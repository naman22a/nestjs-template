import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService, MailService, TokenService } from './services';
import { UsersModule } from '../shared';

@Module({
    imports: [UsersModule],
    controllers: [AuthController],
    providers: [AuthService, MailService, TokenService],
})
export class AuthModule {}
