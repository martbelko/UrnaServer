import express from 'express';
import jwt from 'jsonwebtoken';

import { AuthPayload, generateAccessToken } from '../auth/auth';
import { NullError } from '../error';

export const router = express.Router();

router.post('/auth/token', async (req, res) => {
    const refreshToken = req.body.token as string;
    if (refreshToken == undefined) {
        const error = new NullError('token');
        return res.status(error.status).send({ error: error });
    }

    // TODO: Add database check for refresh token

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (error, payload) => {
        if (error != null) {
            return res.sendStatus(403);
        }

        const payloadToken = payload as unknown as AuthPayload;
        const user: AuthPayload = {
            id: payloadToken.id,
            createdAt: payloadToken.createdAt
        };

        const accessToken = generateAccessToken(user);
        return res.send({ accessToken: accessToken });
    });
});

export default router;
