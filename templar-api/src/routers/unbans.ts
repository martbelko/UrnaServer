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

router.post('/api/unbans', async (req, res) => {
    if (req.body.banid == undefined) {
        res.send({ error: '\'banid\' property missing' });
        return;
    }

    const banID = Number(req.body.banid as string);
    if (isNaN(banID)) {
        res.send({ error: `'banid' property must be a number, but was '${req.body.banid}'` });
        return;
    }

    const steamid = req.body.steamid as string;
    if (steamid == undefined) {
        res.send({ error: '\'steamid\' property missing' });
        return;
    }

    const reason = req.body.reason as string;
    if (reason == undefined) {
        res.send({ error: '\'reason\' property missing' });
        return;
    }

    try {
        const ban = await prisma.ban.update({
            where: {
                id: banID
            },
            data: {
                unban: {
                    create: {
                        reason: reason,
                        admin: {
                            connect: {
                                steamID: steamid
                            }
                        }
                    }
                }
            }
        });

        res.send({ ban: ban });
    } catch (e) {
        res.send({ error: e });
    }
});

export default router;
