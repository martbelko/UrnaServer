import { PrismaClient } from '@prisma/client';
import express from 'express';

import { validateFlags, validateImmunity, validateSteamID } from './validators/adminValidator';
import { PrismaClientValidationError } from '@prisma/client/runtime';

const prisma = new PrismaClient();
export const router = express.Router();

interface AdminGet {
    id: number | undefined;
    steamid: string | undefined;
    flags: number | undefined;
    email: string | undefined;
    name: string | undefined;
}

router.get('/api/admins', (req, res, next) => {
    const id = Number(req.query.id as string);
    const name = req.query.name as string;
    const steamid = req.query.steamid as string;
    const email = req.query.email as string;
    const flags = Number(req.query.flags as string);

    const admin: AdminGet = {
        id: isNaN(id) ? undefined : id,
        name: name,
        steamid: steamid,
        email: email,
        flags: isNaN(flags) ? undefined : flags
    };

    req.params = admin;
    next();
},
async (req, res) => {
    const admin = req.params as AdminGet;
    const admins = await prisma.admin.findMany({
        where: {
            id: admin.id,
            steamID: admin.steamid,
            flags: admin.flags,
            user: {
                name: admin.name,
                email: admin.email
            }
        }
    });

    res.send(JSON.stringify(admins));
});

interface AdminPost {
    steamid: string;
    flags: number;
    immunity: number;
    userid: number;
}

router.post('/api/admins', (req, res, next) => {
    if (req.body instanceof Array) {
        return res.send({ error: 'Maximum 1 admin insertion' });
    }

    const steamid = req.body.steamid as string;
    const flagsStr = req.body.flags as string;
    const immunityStr = req.body.immunity as string;
    const useridStr = req.body.userid as string;

    if (flagsStr == undefined) {
        return res.send({ error: '\'flags\' property missing' });
    }

    if (immunityStr == undefined) {
        return res.send({ error: '\'immunity\' property missing' });
    }

    if (useridStr == undefined) {
        return res.send({ error: '\'userid\' property missing' });
    }

    const flags = Number(flagsStr);
    const immunity = Number(immunityStr);
    const userid = Number(useridStr);

    {
        const error = validateSteamID(steamid);
        if (error != null) {
            return res.send({ error: error });
        }
    }

    {
        const error = validateFlags(flags);
        if (error != null) {
            return res.send({ error: error });
        }
    }

    {
        const error = validateImmunity(immunity);
        if (error != null) {
            return res.send({ error: error });
        }
    }

    const admin: AdminPost = {
        steamid: steamid,
        flags: flags,
        immunity: immunity,
        userid: userid
    };

    req.params = admin;
    next();
},
async (req, res) => {
    const admin = req.params as AdminPost;
    try {
        const insertedAdmin = await prisma.admin.create({
            data: {
                steamID: admin.steamid,
                flags: admin.flags,
                immunity: admin.immunity,
                user: {
                    connect: {
                        id: admin.userid
                    }
                }
            }
        });

        res.send({ admin: insertedAdmin });
    } catch (e) {
        if (e instanceof PrismaClientValidationError) {
            const index = e.message.search('\n\nArgument flags:') + 2;
            const message = e.message.substring(index, e.message.length - 2);
            return res.send({ error: message });
        }

        return res.send({ error: e });
    }
});

router.patch('/api/admins/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.send({ error: `'id' property must be a number, but was '${req.params.id}'` });
    }

    const steamid = req.body.steamid as string;
    if (steamid != undefined) {
        const error = validateSteamID(steamid);
        if (error != null) {
            return res.send({ error: error });
        }
    }

    const flags = req.body.flags == undefined ? undefined : Number(req.body.flags as string);
    if (flags != undefined) {
        const error = validateFlags(flags);
        if (error != null) {
            return res.send({ error: error });
        }
    }

    {
        const admin = await prisma.admin.findFirst({
            where: {
                id: id
            }
        });

        if (admin?.steamID == 'CONSOLE') {
            return res.send({ error: 'Cannot update admin \'CONSOLE\'' });
        }
    }

    const admin = await prisma.admin.update({
        where: {
            id: id
        },
        data: {
            steamID: steamid,
            flags: flags
        }
    });

    return res.send({ admin: admin });
});

router.delete('/api/admins/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.send({ error: `'id' must be a number, but was '${req.params.id}'` });
    }

    {
        const admin = await prisma.admin.findFirst({
            where: {
                id: id
            }
        });

        if (admin?.steamID == 'CONSOLE') {
            return res.send({ error: 'Cannot delete admin \'CONSOLE\'' });
        }
    }

    try {
        const admin = await prisma.admin.delete({
            where: {
                id: id
            }
        });

        return res.send({ admin: admin });
    } catch (e) {
        return res.send({ error: e });
    }
});

export default router;
