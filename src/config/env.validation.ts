import { plainToInstance } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    Matches,
    validateSync,
} from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Provision = 'provision',
}

export class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNumber()
    PORT: number;

    @Matches(
        /^postgresql:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/([^?]+)\?schema=([^&]+)$/,
    )
    DB_URL: string;

    @IsNotEmpty()
    ACCESS_TOKEN_SECRET: string;

    @IsNotEmpty()
    REFRESH_TOKEN_SECRET: string;

    @IsNotEmpty()
    REDIS_URL: string;

    @IsNotEmpty()
    CORS_ORIGIN: string;

    @IsNotEmpty()
    COOKIE_DOMAIN: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
