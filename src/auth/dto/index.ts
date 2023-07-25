import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'Naman', description: 'The name of the user' })
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @ApiProperty({
        example: 'foo@bar.com',
        description: 'The email of the user',
    })
    @IsEmail({}, { message: 'invalid email' })
    email: string;

    @ApiProperty({
        example: 'some_random_password',
        description: 'The password of the user',
        minLength: 6,
    })
    @MinLength(6, { message: 'password must be atleast 6 characters long' })
    password: string;
}

export class LoginDto {
    @ApiProperty({
        example: 'foo@bar.com',
        description: 'The email of the user',
    })
    @IsEmail({}, { message: 'invalid email' })
    email: string;

    @ApiProperty({
        example: 'some_random_password',
        description: 'The password of the user',
    })
    @IsNotEmpty({ message: 'password is required' })
    password: string;
}

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'foo@bar.com',
        description: 'The email of the user',
    })
    @IsEmail({}, { message: 'invalid email' })
    email: string;
}
export class ResetPasswordDto {
    @ApiProperty({
        example: 'some_random_password',
        description: 'The password of the user',
        minLength: 6,
    })
    @MinLength(6, { message: 'password must be atleast 6 characters long' })
    password: string;
}
