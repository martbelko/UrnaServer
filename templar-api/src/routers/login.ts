import { PrismaClient } from '@prisma/client';
import express from 'express';
import { TextDecoder } from 'util';
import { AuthPayload, generateAccessToken, generateRefreshToken } from '../auth/auth';
import { NullError } from '../error';

import { hashPassword, unhashSalt } from './../database';

const prisma = new PrismaClient();
export const router = express.Router();

router.post('/auth/login', async (req, res) => {
    const username = req.body.username as string;
    const password = req.body.password as string;

    if (username == undefined) {
        const error = new NullError('username');
        return res.status(error.status).send({ error: error });
    }

    if (password == undefined) {
        const error = new NullError('password');
        return res.status(error.status).send({ error: error });
    }

    const user = await prisma.user.findFirst({
        select: {
            id: true,
            createdAt: true,
            password: true
        },
        where: {
            name: username,
        }
    });

    if (user == null) {
        return res.send({ error: 'Invalid username or password' });
    }

    const salt = unhashSalt(user.password.salt);
    const hashedPassword = hashPassword(password, salt);
    const hashedPasswordDatabase = new TextDecoder().decode(Uint8Array.from(user.password.password));
    if (hashedPassword !== hashedPasswordDatabase) {
        return res.send({ error: 'Invalid username or password' });
    }

    const payload: AuthPayload = {
        id: user.id,
        createdAt: user.createdAt
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.send({ accessToken: accessToken, refreshToken: refreshToken });
});

router.delete('/auth/logout', (req, res) => {
    // TODO: Delete refresh token from database
    res.sendStatus(204);
});

export default router;
