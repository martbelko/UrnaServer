import { PrismaClient } from '@prisma/client';
import express from 'express';

import { validateUserEmail, validateUserName } from './validators/userValidator';
import { validatePassword } from './validators/passwordValidator';
import { validateFlags, validateSteamID } from './validators/adminValidator';
import { generateSalt, hashPassword, hashSalt } from './database';

const prisma = new PrismaClient();
export const router = express.Router();

router.get('/api/admins', async (req, res) => {
    const id = Number(req.query.id as string);
    const name = req.query.name as string;
    const steamid = req.query.steamid as string;
    const email = req.query.email as string;
    const flags = Number(req.query.flags);

    if (req.query.id != undefined && isNaN(id)) {
        res.send({ error: `'id' must be a number, but was ${req.query.id}` });
        return;
    }

    if (req.query.flags != undefined && isNaN(flags)) {
        res.send({ error: `'flags' must be a number, but was ${req.query.flags}` });
        return;
    }

    const admins = await prisma.admin.findMany({
        where: {
            id: Number.isNaN(id) ? undefined : id,
            steamID: steamid,
            flags: Number.isNaN(flags) ? undefined : flags,
            user: {
                name,
                email
            },
        },
    });

    res.send(JSON.stringify(admins));
});

router.post('/api/admins', async (req, res) => {
    if (req.body instanceof Array) {
        res.send({ error: 'Maximum 1 admin insertion' });
        return;
    }

    const admin = req.body;

    const steamidError = validateSteamID(admin.steamid);
    if (steamidError != null) {
        res.send({ error: steamidError });
        return;
    }

    const flagsError = validateFlags(admin.flags);
    if (flagsError != null) {
        res.send({ error: flagsError });
        return;
    }

    const nameError = validateUserName(admin.name);
    if (nameError != null) {
        res.send({ error: nameError });
        return;
    }

    const emailError = validateUserEmail(admin.email);
    if (emailError != null) {
        res.send({ error: emailError });
        return;
    }

    const passwordError = validatePassword(admin.password);
    if (passwordError != null) {
        res.send({ error: passwordError });
        return;
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(admin.password, salt);
    const hashedSalt = hashSalt(salt);

    try {
        const insertedAdmin = await prisma.admin.create({
            data: {
                steamID: admin.steamid,
                flags: admin.flags,
                user: {
                    create: {
                        name: admin.name,
                        email: admin.email,
                        password: {
                            create: {
                                password: hashedPassword,
                                salt: hashedSalt,
                            },
                        },
                    },
                },
            },
        });

        if (insertedAdmin != null) {
            res.send({ admin: insertedAdmin });
        } else {
            res.send({ error: 'Unknown error' });
        }
    } catch (e) {
        res.send({ error: e });
    }
});

export default router;
