import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @IsEmail({}, { message: 'invalid email' })
    email: string;

    @MinLength(6, { message: 'password must be atleast 6 characters long' })
    password: string;
}
