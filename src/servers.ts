import { PrismaClient } from '@prisma/client';
import express from 'express';

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

    res.send(JSON.stringify(server));
});

export default router;
