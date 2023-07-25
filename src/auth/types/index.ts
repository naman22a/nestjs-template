import { FieldError } from '../../common/interfaces';

export interface AccessTokenResponse {
    accessToken: string;
    errors?: FieldError[];
}

export interface AccessTokenPayload {
    userId: number;
}

export interface RefreshTokenPayload {
    userId: number;
    tokenVersion: number;
}
