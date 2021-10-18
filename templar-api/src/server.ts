import express from 'express';
import cors from 'cors';

import adminRouter from './routers/admins';
import userRouter from './routers/users';
import bansRouter from './routers/bans';
import playerInfoRouter from './routers/playerInfo';
import unbansRouter from './routers/unbans';
import serversRouter from './routers/servers';
import vipsRouter from './routers/vips';
import loginRouter from './routers/login';
import authRouter from './routers/auth';
import emailRouter from './routers/verifyEmail';

import { validateAuthHeaderMiddleware } from './utils/authHeaderValidator';
import validateDateHeader from './utils/dateHeaderValidator';

export function createServer(includeRateLimiter = true): express.Application {
    const app = express();

    const rateLimiter = new Map<string, number>();
    const clearIntervalSeconds = 1;
    const maximumRequeststhreshold = 10;

    if (includeRateLimiter) {
        setInterval(() => {
            rateLimiter.clear();
        }, clearIntervalSeconds * 1000);
    }

    app.use(express.json());
    app.use(cors());
    app.use((req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress;
        if (ip == undefined) {
            return res.send('Unknown source IP address').sendStatus(401);
        }

        if (includeRateLimiter) {
            const number = rateLimiter.get(ip);
            if (number == undefined) {
                rateLimiter.set(ip, 1);
            } else if (number < maximumRequeststhreshold) {
                rateLimiter.set(ip, number + 1);
            } else {
            // TODO: Return BaseError
                return res.status(403).send({ error: `Maximum request threshold ${maximumRequeststhreshold}requests/${clearIntervalSeconds}s exceeded` });
            }
        }

        next();
    });

    app.use(validateDateHeader);
    app.enable('trust proxy');

    app.get('/', validateAuthHeaderMiddleware, async (req, res) => {
        return res.send('OK');
    });

    app.get('/api/admins', adminRouter);
    app.post('/api/admins', adminRouter);
    app.patch('/api/admins/:id', adminRouter);
    app.delete('/api/admins/:id', adminRouter);

    app.get('/api/users', userRouter);
    app.post('/api/users', userRouter);
    app.patch('/api/users/:id', userRouter);

    app.get('/api/bans', bansRouter);
    app.post('/api/bans', bansRouter);

    app.get('/api/playerInfo/:id', playerInfoRouter);

    app.get('/api/unbans/:id', unbansRouter);
    app.post('/api/unbans', unbansRouter);

    app.get('/api/servers/:id', serversRouter);
    app.post('/api/servers', serversRouter);

    app.get('/api/vips', vipsRouter);
    app.post('/api/vips', vipsRouter);

    app.post('/auth/login', loginRouter);
    app.delete('/auth/logut', loginRouter);

    app.post('/auth/token', authRouter);

    app.get('/api/verify-email/:token', emailRouter);
    app.post('/api/verify-email', emailRouter);

    return app;
}

export default createServer;
