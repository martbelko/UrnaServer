import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { AuthPayload } from '../auth/auth';
import BaseError, { ErrorType } from '../error';
import { dateDiff } from './dates';
import { MaximumTimeOffsetSeconds } from '../globals';
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

dotenv.config();

export enum AuthHeaderError {
    MissingHeader = 0,
    InvalidHeader = 1
}

export async function validateAuthHeader(authHeader: string | undefined): Promise<number | AuthPayload> {
    const header = authHeader?.split(' ');
    if (header == undefined) {
        return 401;
    }

    if (header.length != 2 || header[0] != 'Bearer') {
        return AuthHeaderError.InvalidHeader;
    }

    const token = header[1];
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        if (typeof payload == 'string') {
            console.log('error');
            return 401;
        }

        const payloadUser = payload as unknown as AuthPayload;
        if (payloadUser.id == undefined || payloadUser.createdAt == undefined) {
            return 401;
        }

        const userInDatabase = await prisma.user.findFirst({
            where: {
                id: payloadUser.id,
                createdAt: payloadUser.createdAt
            }
        });

        if (userInDatabase == null) {
            return 401;
        }

        const user: AuthPayload = {
            id: payloadUser.id,
            createdAt: payloadUser.createdAt
        };

        return user;
    } catch (e) {
        return 401;
    }
}

export function validateDateHeader(req: Request, res: Response, next: NextFunction): void | Response<unknown, Record<string, unknown>> {
    const headerDate = new Date(req.headers.date as string);
    if (headerDate.toString() == 'Invalid Date') {
        const error: BaseError = {
            type: ErrorType.InvalidTimestamp,
            title: 'Invalid timestamp',
            status: 401,
            detail: 'Specified timestamp was invalid'
        };

        return res.status(error.status).send({ error: error });
    }

    const timeNow = new Date(Date.now());
    const diffTime = dateDiff(headerDate, timeNow);
    if (diffTime > MaximumTimeOffsetSeconds) {
        const error: BaseError = {
            type: ErrorType.ExpiredTimestamp,
            title: 'Timestamp expired',
            status: 401,
            detail: `Timestamp expired: Given timestamp ${headerDate} not within ${MaximumTimeOffsetSeconds} of server time ${timeNow}`
        };

        return res.status(error.status).send({ error: error });
    }

    return next();
}
