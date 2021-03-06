import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Constants } from './../Constants';

dotenv.config();

export interface AccessTokenPayload {
    userID: number;
    userCreatedAt: Date;
    refreshTokenID: number;
}

export interface RefreshTokenPayload {
    userID: number;
    userCreatedAt: Date;
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
        try {
            const jwtPayload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);
            if (typeof jwtPayload === 'string') {
                return null;
            }

            return jwtPayload as unknown as AccessTokenPayload;
        } catch(ex) {
            return null;
        }
    }

    public static verifyRefreshToken(refreshToken: string): RefreshTokenPayload | null {
        try {
            const jwtPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
            if (typeof jwtPayload === 'string') {
                return null;
            }

            return jwtPayload as unknown as RefreshTokenPayload;
        } catch (ex) {
            return null;
        }
    }

    private static readonly ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    private static readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
}
