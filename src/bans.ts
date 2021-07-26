import { PrismaClient } from '@prisma/client';
import express from 'express';
import { validateBanLength, validateBanReason } from './validators/banValidator';
import { validateIP } from './validators/serverValidator';
import { parseBanType } from './enums';
import { NullError } from './error';
import { validateSteamID } from './validators/adminValidator';

const prisma = new PrismaClient();
export const router = express.Router();

interface Admin {
    id: string | undefined;
    steamid: string | undefined;
    name: string | undefined;
    email: string | undefined;
}

type SortOrder = 'asc' | 'desc';

/*
    id=6
    type=3
    targetInfo[steamid]=STEAM_1:0:123456
    targetInfo[ip]=192.168.100.1
    admin[id]=1
    admin[steamid]=STEAM_0:1:123456
    admin[name]=adminname
    admin[email]=admin@urna.com
    order=asc | desc
    sortBy=id | date
*/
router.get('/api/bans', async (req, res) => {
    const id = Number(req.query.id as string);
    const type = parseBanType(req.query.type as string);

    const targetInfo = (req.query.targetInfo == undefined)
        ? { steamid: undefined, ip: undefined }
        : req.query.targetInfo as { steamid: string, ip: string };
    const admin: Admin = (req.query.admin == undefined)
        ? {
            id: undefined, steamid: undefined, name: undefined, email: undefined,
        }
        : req.query.admin as unknown as Admin;

    function getOrderBy(sortBy: string | undefined, order: string | undefined) {
        function getSortOrder(): SortOrder {
            return order == undefined || order == 'asc' ? 'asc' : 'desc';
        }

        if (sortBy == 'id')
            return { id: getSortOrder() };
        if (sortBy == 'date')
            return { dateTime: getSortOrder() };

        return {};
    }

    const bans = await prisma.ban.findMany({
        where: {
            id: Number.isNaN(id) ? undefined : id,
            type,
            targetInfo: {
                steam2ID: targetInfo.steamid,
                ip: targetInfo.ip
            },
            admin: {
                id: admin.id == undefined ? undefined : Number(admin.id),
                steamID: admin.steamid,
                user: {
                    name: admin.name
                },
            },
        },
        orderBy: getOrderBy(req.query.sortBy as string, req.query.order as string)
    });

    res.send(JSON.stringify(bans));
});

/*
    {
        "type": "NORMAL",
        "adminSteamID": "STEAM_0:1:123456",
        "targetInfo": {
            "steamID": "STEAM_1:0:123456",
            "steam3ID": "1116516161",
            "steam64ID": "2616516164165",
            "ip": "192.168.100.1",
            "name": "targetName"
        }
    }
*/
router.post('/api/bans', async (req, res) => {
    const typeStr = req.body.type;
    if (typeStr == undefined) {
        const error = new NullError('type');
        return res.status(error.status).send({ error: error });
    }

    const type = parseBanType(typeStr);
    if (type == undefined) {
        const error = new NullError('type');
        return res.status(error.status).send({ error: error });
    }

    const adminSteamid = req.body.adminSteamid as string;
    {
        const error = validateSteamID(adminSteamid, 'adminSteamid');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const targetInfoJson = req.body.target;
    if (targetInfoJson == undefined) {
        const error = new NullError('target');
        return res.status(error.status).send({ error: error });
    }

    const targetSteamID = targetInfoJson.steamid;
    const targetSteam3ID = targetInfoJson.steam3id;
    const targetSteam64ID = targetInfoJson.steam64id;
    const targetIP = targetInfoJson.ip;
    const targetName = targetInfoJson.name;

    {
        const error = validateSteamID(targetSteamID, 'target.steamid');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    if (targetSteam3ID == undefined) {
        const error = new NullError('target.steam3id');
        return res.status(error.status).send({ error: error });
    }

    if (targetSteam64ID == undefined) {
        const error = new NullError('target.steam64id');
        return res.send({ error: error });
    }

    {
        const error = validateIP(targetIP, 'target.ip');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    if (targetName == undefined) {
        const error = new NullError('target.name');
        return res.status(error.status).send({ error: error });
    }

    const lengthStr = req.body.length as string;
    {
        const error = validateBanLength(lengthStr, 'length');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }
    const length = Number(lengthStr);

    const reason = req.body.reason as string;
    {
        const error = validateBanReason(reason, 'reason');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const serverIP = req.body.serverip as string;
    {
        const error = validateIP(serverIP, 'serverip');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    try {
        const ban = await prisma.ban.create({
            data: {
                type: type,
                targetInfo: {
                    create: {
                        name: targetName,
                        ip: targetIP,
                        steam2ID: targetSteamID,
                        steam3ID: targetSteam3ID,
                        steamID64: targetSteam64ID
                    }
                },
                admin: {
                    connect: {
                        steamID: adminSteamid
                    }
                },
                length: length,
                reason: reason,
                server: {
                    connect: {
                        ip: serverIP
                    }
                }
            }
        });

        return res.send({ ban: ban });
    } catch (e) {
        return res.send({ error: e });
    }
});

export default router;
