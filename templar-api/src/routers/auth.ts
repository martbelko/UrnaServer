import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';

import { AccessTokenPayload, RefreshTokenPayload, generateAccessToken } from '../auth/auth';
import { NullError } from '../error';

const prisma = new PrismaClient();
export const router = express.Router();

router.post('/auth/token', async (req, res) => {
    const refreshToken = req.body.token as string;
    if (refreshToken == undefined) {
        const error = new NullError('token');
        return res.status(error.status).send({ error: error });
    }

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
    if (typeof payload == 'string') {
        return 401;
    }

    const refreshTokenPayload = payload as unknown as RefreshTokenPayload;
    if (refreshTokenPayload.userid == undefined || refreshTokenPayload.createdAt == undefined) {
        return 401;
    }

    const refreshTokenDb = await prisma.refreshToken.findFirst({
        where: {
            userID: refreshTokenPayload.userid,
            createdAt: refreshTokenPayload.createdAt
        }
    });

    if (refreshTokenDb == null) {
        return res.sendStatus(401);
    }

    const accessTokenPayload: AccessTokenPayload = {
        userid: refreshTokenPayload.userid,
        createdAt: refreshTokenPayload.createdAt,
        refreshTokenId: refreshTokenDb.id
    };

    const accessToken = generateAccessToken(accessTokenPayload);
    return res.send({ accessToken: accessToken });
});

export default router;
