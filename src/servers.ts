import { PrismaClient } from '@prisma/client';
import express from 'express';
import { validateIP } from './validators/serverValidator';

const prisma = new PrismaClient();
export const router = express.Router();

router.get('/api/servers/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.send({ error: `id must be a number, but was '${req.params.id}'` });
        return;
    }

    const server = await prisma.server.findFirst({
        where: {
            id: id
        }
    });

    if (server == null) {
        res.send({ error: `Server with '${id}' was not found` });
        return;
    }

    res.send({ server: server });
});

router.post('/api/servers', async (req, res) => {
    const name = req.body.name as string;
    if (name == undefined) {
        res.send({ error: '\'name\' property missing' });
        return;
    }

    const ip = req.body.ip as string;
    if (ip == undefined) {
        res.send({ error: '\'ip\' property missing' });
        return;
    }

    {
        const ipError = validateIP(ip);
        if (ipError != null) {
            res.send({ error: ipError });
            return;
        }
    }

    const server = await prisma.server.create({
        data: {
            ip: ip,
            name: name
        }
    });

    res.send({ server: server });
});

export default router;
