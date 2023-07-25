import { Injectable } from '@nestjs/common';
import { User, UsersService } from '../../../shared';
import { LoginDto } from '../../dto';
import { FieldError } from '../../../common/interfaces';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validate(data: LoginDto): Promise<{
        user: User | null;
        errors?: FieldError[];
    }> {
        const { email, password } = data;

        // check if user exists
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            return {
                user: null,
                errors: [{ field: 'email', message: 'user not found' }],
            };
        }

        // check if password is correct
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return {
                user: null,
                errors: [{ field: 'password', message: 'wrong password' }],
            };
        }

        // check if user is verified
        if (!user.isVerified) {
            return {
                user: null,
                errors: [
                    { field: 'email', message: 'please verify the email' },
                ],
            };
        }

        return { user };
    }
}
