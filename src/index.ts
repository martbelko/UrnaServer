import { PrismaClient } from '@prisma/client';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import adminRouter from './admins';
import userRouter from './users';
import bansRouter from './bans';
import playerInfoRouter from './playerInfo';

export const prisma = new PrismaClient();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.get('/', async (req, res) => {
    console.log(req.body);
    res.send('Almost');
});

app.get('/api/admins', adminRouter);
app.post('/api/admins', adminRouter);

app.get('/api/users', userRouter);
app.post('/api/users', userRouter);

app.get('/api/bans', bansRouter);
app.post('/api/bans', bansRouter);

app.get('/api/playerInfo/:id', playerInfoRouter);

async function main() {
    app.listen(port, () => console.log(`Listening on port ${port}`));
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
