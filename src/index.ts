import { PrismaClient } from '@prisma/client';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

import adminRouter from './admins';
import userRouter from './users';
import bansRouter from './bans';
import playerInfoRouter from './playerInfo';
import unbansRouter from './unbans';
import serversRoutes from './servers';

export const prisma = new PrismaClient();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.get('/', async (req, res) => {
    res.send('Available routers: [\'/api/admins\', \'/api/users\', \'/api/bans\', \'/api/playerInfo/:id\', \'/api/servers/:id\', \'/api/unbans/:id\']');
});

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('server.crt')
};

const server = https.createServer(options, app);

app.get('/api/admins', adminRouter);
app.post('/api/admins', adminRouter);

app.get('/api/users', userRouter);
app.post('/api/users', userRouter);

app.get('/api/bans', bansRouter);
app.post('/api/bans', bansRouter);

app.get('/api/playerInfo/:id', playerInfoRouter);

app.get('/api/unbans/:id', unbansRouter);

app.get('/api/servers/:id', serversRoutes);

async function main() {
    server.listen(port, () => console.log(`Listening on port ${port}`));
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
