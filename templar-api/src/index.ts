import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';

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

import validateAuthHeader from './utils/authHeaderValidator';
import validateDateHeader from './utils/dateHeaderValidator';

dotenv.config();

const prisma = new PrismaClient();

const app = express();
const port = Number(process.env.PORT as string);

const rateLimiter = new Map<string, number>();
const clearIntervalSeconds = 1;
const maximumRequeststhreshold = 10;

setInterval(() => {
    rateLimiter.clear();
}, clearIntervalSeconds * 1000);

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress;
    if (ip == undefined) {
        return res.sendStatus(401);
    }

    const number = rateLimiter.get(ip);
    if (number == undefined) {
        rateLimiter.set(ip, 1);
    } else if (number < maximumRequeststhreshold) {
        rateLimiter.set(ip, number + 1);
    } else {
        return res.status(403).send({ error: `Maximum request threshold ${maximumRequeststhreshold}requests/${clearIntervalSeconds}s exceeded` });
    }

    next();
});
app.use(validateDateHeader);
app.enable('trust proxy');

app.get('/', async (req, res) => {
    const user = validateAuthHeader(req.headers.authorization);
    if (typeof user == 'number') {
        return res.sendStatus(user);
    }

    return res.send('OK');
});

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('server.crt')
};

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

async function main() {
    //await prisma.refreshToken.deleteMany();
    app.listen(port, () => console.log(`Listening on port ${port}`));
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
