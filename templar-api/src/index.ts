import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { MessageClient, MessageClientOptions } from 'cloudmailin';

import adminRouter from './admins';
import userRouter from './users';
import bansRouter from './bans';
import playerInfoRouter from './playerInfo';
import unbansRouter from './unbans';
import serversRouter from './servers';
import vipsRouter from './vips';
import { hashPassword, unhashSalt } from './database';
import { TextDecoder } from 'util';

export const prisma = new PrismaClient();

const app = express();
const x: MessageClientOptions = {
    username: 'martbelko@gmail.com',
    apiKey: 'Kat8qq9np7'
};
const emailClient = new MessageClient(x);
const port = 5000;

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

function sendMail(req: any, res: any) {
    const name = req.body.name;
    const from = req.body.from;
    const message = req.body.message;
    const to = 'martbelko@gmail.com';
    const smtpTransport = emailClient.createTransport('SMTP',{
        service: 'Gmail',
        auth: {
            user: '******@gmail.com',
            pass: '*****'
        }
    });
    const mailOptions = {
        from: from,
        to: to,
        subject: name+' | new message !',
        text: message
    };
    smtpTransport.sendMail(mailOptions, function(error: any, response: any) {
        if(error) {
            console.log(error);
        } else {
            res.redirect('/');
        }
    });
}

app.get('/test', async (req, res) => {
    const response = await emailClient.sendMessage({
        to: 'martbelko@gmail.com',
        from: 'martbelko@gmail.com',
        plain: 'test message',
        html:  '<h1>Test Message</h1>',
        subject: 'hello world'
    });
    return res.send(response);
});

app.post('/api/login', async (req, res) => {
    const username = req.body.username as string;
    const password = req.body.password as string;
    if (username == undefined) {
        return res.send({ error: '\'username\' property missing' });
    }

    if (password == undefined) {
        return res.send({ error: '\'password\' property missing' });
    }

    const user = await prisma.user.findFirst({
        select: {
            id: true,
            name: true,
            email: true,
            password: true
        },
        where: {
            name: username
        }
    });

    if (user == null) {
        return res.send({ error: 'No user found' });
    }

    const hashedSalt = user.password.salt;
    const hashedPassword = new TextDecoder().decode(Uint8Array.from(user.password.password));

    const salt = unhashSalt(hashedSalt);
    const hashedPassword2 = hashPassword(password, salt);

    if (hashedPassword != hashedPassword2) {
        return res.send({ error: 'Passwords doesnt match' });
    }

    if (process.env.ACCESS_TOKEN_SECRET == undefined) {
        return res.send({ error: 'Invalid token' });
    }

    const accessToken = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET);
    return res.send({ token: accessToken });
});

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
