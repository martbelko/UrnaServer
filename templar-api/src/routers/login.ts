import { PrismaClient } from '@prisma/client';
import express from 'express';
import { TextDecoder } from 'util';
import jwt from 'jsonwebtoken';
import { AccessTokenPayload, RefreshTokenPayload, generateAccessToken, generateRefreshToken } from '../auth/auth';
import { NullError } from '../error';
import validateAuthHeader from '../utils/authHeaderValidator';
import dotenv from 'dotenv';

import { hashPassword, unhashSalt } from './../database';

const prisma = new PrismaClient();
export const router = express.Router();

dotenv.config();

const tries = new Map<string, number>();
const clearIntervalSeconds = 5 * 60;

setInterval(() => {
    tries.clear();
}, clearIntervalSeconds * 1000);

function incrementTries(ip: string): void {
    const currTries = () => {
        const number = tries.get(ip);
        if (number == undefined) {
            return 0;
        }

        return number;
    };

    tries.set(ip, currTries() + 1);
}

function hasMaximumTries(ip: string): boolean {
    const currTries = tries.get(ip);
    if (currTries != undefined && currTries > 10) {
        return true;
    }

    return false;
}

router.post('/auth/login', async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress;
    if (ip == undefined) {
        return res.status(401).send({ error: 'Undefined IP address' });
    }

    if (hasMaximumTries(ip)) {
        return res.status(403).send({ error: 'Maximum number of tries exceeded' });
    }

    const username = req.body.username as string;
    const password = req.body.password as string;

    if (username == undefined) {
        incrementTries(ip);
        const error = new NullError('username');
        return res.status(error.status).send({ error: error });
    }

    if (password == undefined) {
        incrementTries(ip);
        const error = new NullError('password');
        return res.status(error.status).send({ error: error });
    }

    const user = await prisma.user.findFirst({
        select: {
            id: true,
            createdAt: true,
            password: true,
            refreshTokens: true
        },
        where: {
            name: username
        }
    });

    if (user == null) {
        incrementTries(ip);
        return res.send({ error: 'Invalid username or password' });
    }

    const salt = unhashSalt(user.password.salt);
    const hashedPassword = hashPassword(password, salt);
    const hashedPasswordDatabase = new TextDecoder().decode(Uint8Array.from(user.password.password));
    if (hashedPassword !== hashedPasswordDatabase) {
        incrementTries(ip);
        return res.send({ error: 'Invalid username or password' });
    }

    const indices = [];
    for (const token of user.refreshTokens) {
        const payload = jwt.verify(token.token, process.env.REFRESH_TOKEN_SECRET as string);
        if (typeof payload == 'string') {
            indices.push(token.id);
        }
    }

    for (const refTokenId of indices) {
        await prisma.refreshToken.delete({
            where: {
                id: refTokenId
            }
        });
    }

    const refreshTokenPayload: RefreshTokenPayload = {
        userid: user.id,
        createdAt: user.createdAt
    };
    const refreshToken = generateRefreshToken(refreshTokenPayload);

    const refreshTokenDb = await prisma.refreshToken.create({
        data: {
            userID: user.id,
            token: refreshToken,
            expiresIn: 7 * 24 * 60 * 60 // 1 week
        }
    });

    const accessTokenPayload: AccessTokenPayload = {
        userid: user.id,
        createdAt: user.createdAt,
        refreshTokenId: refreshTokenDb.id
    };

    const accessToken = generateAccessToken(accessTokenPayload);
    res.send({ userid: user.id, accessToken: accessToken, refreshToken: refreshToken });
});

router.post('/auth/token', async (req, res) => {
    const refreshToken = req.body.refreshToken as string;
    if (refreshToken == undefined) {
        const error = new NullError('refreshToken');
        res.status(error.status).send({ error: error });
    }

    const user = await prisma.user.findFirst({
        where: {
            refreshTokens: {
                some: {
                    token: refreshToken
                }
            }
        }
    });

    if (user == null) {
        return res.send({ error: 'No user found' });
    }

    const refreshTokenPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
    if (typeof refreshTokenPayload == 'string') {
        return res.send({ error: refreshTokenPayload });
    }

    const payloadUser = refreshTokenPayload as unknown as RefreshTokenPayload;
    if (payloadUser.userid != user.id) {
        return res.send({ error: 'IDs don\'t match' });
    }

    const refreshTokenDb = await prisma.refreshToken.findFirst({
        where: {
            token: refreshToken
        }
    });

    if (refreshTokenDb == null) {
        return res.send({ error: 'No refresh token found' });
    }

    const accessTokenPayload: AccessTokenPayload = {
        userid: user.id,
        refreshTokenId: refreshTokenDb.id,
        createdAt: user.createdAt
    };

    const accessToken = generateAccessToken(accessTokenPayload);
    return res.send({ token: accessToken });
});

router.delete('/auth/logout', async (req, res) => {
    const accessTokenPayload = await validateAuthHeader(req.headers.authorization);
    if (typeof accessTokenPayload == 'number') {
        return res.sendStatus(accessTokenPayload);
    }

    const refreshToken = req.body.refreshToken as string;
    if (refreshToken == undefined) {
        const error = new NullError('refreshToken');
        return res.status(error.status).send({ error: error });
    }

    const count = await prisma.refreshToken.deleteMany({
        where: {
            id: accessTokenPayload.refreshTokenId,
            userID: accessTokenPayload.userid,
            token: refreshToken
        }
    });

    if (count.count == 0) {
        res.send({ error: 'No refresh tokens found' });
    }

    res.status(204).send({ count: count.count });
});

export default router;
