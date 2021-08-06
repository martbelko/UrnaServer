import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { AccessTokenPayload } from '../auth/auth';

const prisma = new PrismaClient();

dotenv.config();

export enum AuthHeaderError {
    MissingHeader = 0,
    InvalidHeader = 1
}

export async function validateAuthHeader(authHeader: string | undefined): Promise<number | AccessTokenPayload> {
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
            return 401;
        }

        const payloadUser = payload as unknown as AccessTokenPayload;
        if (payloadUser.userid == undefined || payloadUser.createdAt == undefined || payloadUser.refreshTokenId == undefined) {
            return 401;
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
            return 401;
        }

        const accessTokenPayload: AccessTokenPayload = {
            userid: payloadUser.userid,
            createdAt: payloadUser.createdAt,
            refreshTokenId: payloadUser.refreshTokenId
        };

        return accessTokenPayload;
    } catch (e) {
        return 401;
    }
}

export default validateAuthHeader;
