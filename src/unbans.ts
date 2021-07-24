import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
export const router = express.Router();

router.get('/api/unbans/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.send({ error: `id must be a number, but was '${req.params.id}'` });
        return;
    }

    const unban = await prisma.unban.findFirst({
        where: {
            id: id
        }
    });

    if (unban == null) {
        res.send({ error: `Unban with '${id}' was not found` });
        return;
    }

    res.send(JSON.stringify(unban));
});

export default router;
