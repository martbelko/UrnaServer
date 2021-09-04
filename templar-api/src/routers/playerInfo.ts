import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
export const router = express.Router();

router.get('/api/playerInfo/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.send({ error: `id must be a number, but was '${req.params.id}'` });
        return;
    }

    const playerInfo = await prisma.playerInfo.findFirst({
        where: {
            id: id
        }
    });

    if (playerInfo == null) {
        res.send({ error: `PlayerInfo with '${id}' was not found` });
        return;
    }

    res.send(JSON.stringify(playerInfo));
});

export default router;