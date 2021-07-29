import jwt from 'jsonwebtoken';

export interface AuthPayload {
    id: number;
    createdAt: Date;
}

export function generateAccessToken(obj: AuthPayload): string {
    return jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: '1m'
    });
}

export function generateRefreshToken(obj: AuthPayload): string {
    return jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: '1w'
    });
}
