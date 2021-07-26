import { PrismaClient } from '@prisma/client';
import express from 'express';
import { validateUserEmail } from './validators/userValidator';
import { validateSteamID } from './validators/adminValidator';
import { parseVipMode } from './enums';
import BaseError, { ErrorType, NullError } from './error';

const prisma = new PrismaClient();
export const router = express.Router();

router.get('/api/vips', async (req, res) => {
    const id = Number(req.query.id as string);
    const mode = parseVipMode(req.query.mode as string);
    const email = req.query.email as string;
    const steamid = req.query.steamid as string;
    const discordName = req.query.discordName as string;

    const vips = await prisma.vip.findMany({
        where: {
            id: Number.isNaN(id) ? undefined : id,
            vipMode: mode,
            email: email,
            steamid: steamid,
            discordName: discordName
        }
    });

    res.send(JSON.stringify(vips));
});

router.post('/api/vips', async (req, res) => {
    const modeStr = req.body.mode as string;
    if (modeStr == undefined) {
        const error = new NullError('mode');
        return res.status(error.status).send({ error: error });
    }

    const mode = parseVipMode(modeStr);
    if (mode == undefined) {
        const error: BaseError = {
            type: ErrorType.InvalidVipMode,
            title: 'Invalid mode parameter',
            status: 401,
            detail: `Mode parameter may be one of these: [CLASSIC, EXTRA], but was ${modeStr}`
        };
        return res.status(error.status).send({ error: error });
    }

    const email = req.body.email as string;
    {
        const error = validateUserEmail(email, 'email');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const steamid = req.body.steamid as string;
    {
        const error = validateSteamID(steamid, 'steamid');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const discordName = req.body.discordName as string | undefined;

    try {
        const vip = await prisma.vip.create({
            data: {
                vipMode: mode,
                email: email,
                steamid: steamid,
                discordName: discordName
            }
        });

        return res.send({ vip: vip });
    } catch (e) {
        return res.send({ error: e });
    }
});

export default router;
