import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Constants } from './../Constants';

dotenv.config();

export interface AccessTokenPayload {
    userID: number;
    createdAt: Date;
    refreshTokenID: number;
}

export interface RefreshTokenPayload {
    userID: number;
    createdAt: Date;
}

export class TokenManager {
    public static init (): void {
        if (this.ACCESS_TOKEN_SECRET == undefined) {
            throw new Error('Invalid ACCESS_TOKEN_SECRET');
        } else if (this.REFRESH_TOKEN_SECRET == undefined) {
            throw new Error('Invalid REFRESH_TOKEN_SECRET');
        }
    }

    public static generateAccessToken(accessTokenPayload: AccessTokenPayload): string {
        return jwt.sign(accessTokenPayload, process.env.ACCESS_TOKEN_SECRET as string, {
            expiresIn: Constants.ACCESS_TOKEN_EXPIRATION
        });
    }

    public static generateRefreshToken(refreshTokenPayload: RefreshTokenPayload): string {
        return jwt.sign(refreshTokenPayload, process.env.REFRESH_TOKEN_SECRET as string, {
            expiresIn: Constants.REFRESH_TOKEN_EXPIRATION
        });
    }

    public static verifyAccessToken(accessToken: string): AccessTokenPayload | null {
        const jwtPayload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);
        if (typeof jwtPayload === 'string') {
            return null;
        }

        const payload = jwtPayload as unknown as AccessTokenPayload;
        if (isNaN(payload.userID) || !isFinite(payload.userID) || isNaN(payload.refreshTokenID) || !isFinite(payload.refreshTokenID)) {
            return null;
        }

        return payload;
    }

    public static verifyRefreshToken(refreshToken: string): RefreshTokenPayload | null {
        const jwtPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
        if (typeof jwtPayload === 'string') {
            return null;
        }

        const payload = jwtPayload as unknown as RefreshTokenPayload;
        if (isNaN(payload.userID) || !isFinite(payload.userID)) {
            return null;
        }

        return payload;
    }

    private static readonly ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    private static readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
}
