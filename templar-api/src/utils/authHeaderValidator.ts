import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { AccessTokenPayload } from '../auth/auth';
import BaseError, { ErrorType, isError } from '../error';
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

dotenv.config();

export enum AuthHeaderError {
    MissingHeader = 0,
    InvalidHeader = 1
}

export async function validateAuthHeader(authHeader: string | undefined): Promise<BaseError | AccessTokenPayload> {
    const header = authHeader?.split(' ');
    if (header == undefined) {
        const error: BaseError = {
            type: ErrorType.InvalidAuthHeader,
            title: 'Missing authorization header',
            status: 401,
            detail: 'Authorization header was missing'
        };
        return error;
    }

    if (header.length != 2 || header[0] != 'Bearer') {
        const error: BaseError = {
            type: ErrorType.InvalidAuthHeader,
            title: 'Invalid authorization header',
            status: 401,
            detail: 'Authorization header was invalid'
        };
        return error;
    }

    const token = header[1];
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        if (typeof payload == 'string') {
            const error: BaseError = {
                type: ErrorType.InvalidAuthHeader,
                title: 'Invalid authorization header',
                status: 401,
                detail: 'Authorization header was invalid'
            };
            return error;
        }

        const payloadUser = payload as unknown as AccessTokenPayload;
        if (payloadUser.userid == undefined || payloadUser.createdAt == undefined || payloadUser.refreshTokenId == undefined) {
            const error: BaseError = {
                type: ErrorType.InvalidAuthHeader,
                title: 'Invalid authorization header',
                status: 401,
                detail: 'Authorization header was invalid'
            };
            return error;
        }

        const userInDatabase = await prisma.user.findFirst({
            where: {
                id: payloadUser.userid,
                createdAt: payloadUser.createdAt,
                refreshTokens: {
                    some: {
                        id: payloadUser.refreshTokenId
                    }
                }
            }
        });

        if (userInDatabase == null) {
            const error: BaseError = {
                type: ErrorType.InvalidAuthHeader,
                title: 'Invalid authorization header',
                status: 401,
                detail: 'Authorization header was invalid'
            };
            return error;
        }

        const accessTokenPayload: AccessTokenPayload = {
            userid: payloadUser.userid,
            createdAt: payloadUser.createdAt,
            refreshTokenId: payloadUser.refreshTokenId
        };

        return accessTokenPayload;
    } catch (e) {
        const error: BaseError = {
            type: ErrorType.InvalidAuthHeader,
            title: 'Invalid authorization header',
            status: 401,
            detail: JSON.stringify(e)
        };
        return error;
    }
}

export async function validateAuthHeaderMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userOrError = validateAuthHeader(req.headers.authorization);
    if (isError(userOrError)) {
        return;
    }
    next();
}

export default validateAuthHeader;
