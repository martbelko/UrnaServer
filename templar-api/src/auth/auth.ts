import jwt from 'jsonwebtoken';

export interface AccessTokenPayload {
    userid: number;
    createdAt: Date;
    refreshTokenId: number;
}

export interface RefreshTokenPayload {
    userid: number;
    createdAt: Date;
}

export function generateAccessToken(obj: AccessTokenPayload): string {
    return jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: '1m'
    });
}

export function generateRefreshToken(obj: RefreshTokenPayload): string {
    return jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: '1w'
    });
}
