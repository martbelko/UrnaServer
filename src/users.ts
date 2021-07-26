import { PrismaClient } from '@prisma/client';
import express from 'express';

import { generateSalt, hashPassword, hashSalt } from './database';
import { validateUserEmail, validateUserName } from './validators/userValidator';
import { validatePassword } from './validators/passwordValidator';
import { TextEncoder } from 'util';
import { generateErrorFromPrismaException } from './error';

const prisma = new PrismaClient();
export const router = express.Router();

interface UserGet {
    id: number;
    name: string;
    email: string;
}

router.get('/api/users', (req, res, next) => {
    const id = Number(req.query.id as string);
    const name = req.query.name as string;
    const email = req.query.email as string;

    req.params = { id: isNaN(id) ? undefined : id, name: name, email: email } as UserGet;
    next();
},
async (req, res) => {
    const user = req.params as UserGet;
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
        },
        where: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });

    res.send(JSON.stringify(users));
});

interface UserPost {
    name: string;
    email: string;
    password: Array<number>;
    salt: string;
}

router.post('/api/users', (req, res, next) => {
    if (req.body instanceof Array) {
        return res.send({ error: 'Can insert only 1 user' });
    }

    const name = req.body.name as string;
    const email = req.body.email as string;
    const password = req.body.password as string;

    {
        const error = validateUserName(name, 'name');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    {
        const error = validateUserEmail(email, 'email');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    {
        const error = validatePassword(password, 'password');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const salt = generateSalt();
    const hashedPassword = new TextEncoder().encode(hashPassword(password, salt));
    const hashedSalt = hashSalt(salt);

    const user: UserPost = {
        name: req.body.name,
        email: req.body.email,
        password: Array.from(hashedPassword),
        salt: hashedSalt
    };

    req.params = user;
    next();
},
async (req, res) => {
    const user = req.params as UserPost;
    try {
        const insertedUser = await prisma.user.create({
            select: {
                id: true,
                name: true,
                email: true
            },
            data: {
                name: user.name,
                email: user.email,
                password: {
                    create: {
                        password: user.password,
                        salt: user.salt
                    }
                }
            }
        });

        res.send({ user: insertedUser });
    } catch (e) {
        const error = generateErrorFromPrismaException(e);
        res.send({ error: error });
    }
});

router.patch('/api/users/:id', (req, res, next) => {
    const id = req.params.id;
    next();
},
(req, res) => {
    return res.send('OK');
});

export default router;
