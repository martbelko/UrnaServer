import { PrismaClient } from '@prisma/client';
import express from 'express';

import { generateSalt, hashPassword, hashSalt } from './database';
import { validateUserEmail, validateUserName } from './validators/userValidator';
import { validatePassword } from './validators/passwordValidator';
import { TextEncoder } from 'util';

const prisma = new PrismaClient();
export const router = express.Router();

router.get('/api/users', async (req, res) => {
    const id = Number(req.query.id as string);
    const name = req.query.name as string;
    const email = req.query.email as string;

    const users = await prisma.user.findMany({
        where: {
            id: isNaN(id) ? undefined : id,
            name: name,
            email: email
        }
    });

    res.send(JSON.stringify(users));
});

router.post('/api/users', async (req, res) => {
    if (req.body instanceof Array) {
        res.send('Can insert only 1 user');
        return;
    }

    const user = req.body;
    {
        const nameError = validateUserName(user.name);
        if (nameError != null) {
            res.send({ error: nameError });
            return;
        }
    }

    {
        const emailError = validateUserEmail(user.email);
        if (emailError != null) {
            res.send({ error: emailError });
            return;
        }
    }

    {
        const passwordError = validatePassword(user.password);
        if (passwordError != null) {
            res.send({ error: passwordError });
            return;
        }
    }

    const salt = generateSalt();
    const hashedPassword = new TextEncoder().encode(hashPassword(user.password, salt));
    const hashedSalt = hashSalt(salt);

    try {
        const insertedUser = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: {
                    create: {
                        password: Array.from(hashedPassword),
                        salt: hashedSalt
                    }
                }
            }
        });

        res.send({ user: insertedUser });
    } catch (e) {
        res.send({ error: e });
    }
});

export default router;
