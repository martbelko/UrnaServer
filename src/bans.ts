import { PrismaClient } from '@prisma/client';
import express from 'express';
import { BanType } from '.prisma/client';

const prisma = new PrismaClient();
export const router = express.Router();

interface Admin {
    id: string | undefined;
    steamid: string | undefined;
    name: string | undefined;
    email: string | undefined;
}

function parseBanType(typeStr: string): BanType {
    if (typeStr === 'NORMAL') { return BanType.NORMAL; }
    if (typeStr === 'CT') { return BanType.CT; }
    if (typeStr === 'GAG') { return BanType.GAG; }
    if (typeStr === 'MUTE') { return BanType.MUTE; }

    return BanType.NONE;
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
    if (req.body.type == undefined) {
        res.send({ error: '\'type\' property is not defined' });
        return;
    }

    const type = parseBanType(req.body.type as string);
    if (type == BanType.NONE) {
        res.send({ error: `'type' property might be on of these: [NORMAL, CT, GAG, MUTE], but was '${req.body.type}'` });
    }

    const adminSteamid = req.body.adminSteamID as string;
    if (adminSteamid == undefined) {
        res.send({ error: '\'adminSteamID\' property is missing' });
        return;
    }

    /*const admin = await prisma.admin.findFirst({
        where: {
            steamID: adminSteamid
        }
    });

    if (admin == null) {
        res.send({ error: `admin with steamid '${adminSteamid}' was not found` });
        return;
    }*/

    const targetInfoJson = req.body.target;
    if (targetInfoJson == undefined) {
        res.send({ error: 'Missing property \'target\'' });
        return;
    }

    const targetSteamID = targetInfoJson.steamID;
    const targetSteam3ID = targetInfoJson.steam3ID;
    const targetSteam64ID = targetInfoJson.steam64ID;
    const targetIP = targetInfoJson.ip;
    const targetName = targetInfoJson.name;

    if (targetSteamID == undefined) {
        res.send({ error: 'Missing property \'target.steamID\'' });
        return;
    }

    if (targetSteam3ID == undefined) {
        res.send({ error: 'Missing property \'target.steam3ID\'' });
        return;
    }

    if (targetSteam64ID == undefined) {
        res.send({ error: 'Missing property \'target.steam64ID\'' });
        return;
    }

    if (targetIP == undefined) {
        res.send({ error: 'Missing property \'target.ip\'' });
        return;
    }

    if (targetName == undefined) {
        res.send({ error: 'Missing property \'target.name\'' });
        return;
    }

    if (req.body.length == undefined) {
        res.send({ error: 'Missing property \'length\'' });
        return;
    }

    const length = Number(req.body.length as string);
    if (isNaN(length)) {
        res.send({ error: `Property 'length' must be a number, but was ${req.body.length}` });
        return;
    }

    const reason = req.body.reason as string;
    if (reason == undefined) {
        res.send({ error: 'Missing property \'reason\'' });
        return;
    }

    const serverIP = req.body.serverIP as string;

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

        res.send({ ban: ban });
    } catch (e) {
        res.send({ error: e });
        return;
    }
});

export default router;
