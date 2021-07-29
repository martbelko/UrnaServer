import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import https from 'https';
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

import { validateAuthHeader } from './utils/authValidator';

const prisma = new PrismaClient();

const app = express();
const port = Number(process.env.PORT as string);

dotenv.config();

app.use(express.json());
app.use(cors());
app.get('/', async (req, res) => {
    res.send('Available routes: \
    [\'/api/admins\', \'/api/users\', \'/api/bans\',\
    \'/api/playerInfo/:id\', \'/api/servers/:id\',\
    \'/api/unbans/:id\']');
});

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('server.crt')
};

const server = https.createServer(options, app);

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
app.delete('/logut', loginRouter);

app.post('/auth/token', authRouter);

app.get('/api/verify-email/:token', emailRouter);
app.post('/api/verify-email', emailRouter);

app.get('/test', async (req, res) => {
    const statusOrUser = await validateAuthHeader(req.headers.authorization);
    if (typeof statusOrUser == 'number') {
        return res.sendStatus(statusOrUser);
    }

    return res.send('OK');
});

async function main() {
    await prisma.refreshToken.deleteMany();
    server.listen(port, () => console.log(`Listening on port ${port}`));
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
