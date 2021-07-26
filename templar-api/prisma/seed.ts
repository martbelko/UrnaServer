import { BanType, PrismaClient } from '@prisma/client';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const prisma = new PrismaClient();

const app = express();

app.use(bodyParser.json());
app.use(cors());

async function main() {
    const consoleUser = await prisma.user.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            name: 'CONSOLE',
            email: 'martbelko@gmail.com',
            passwordID: 0
        }
    });

    const meUser = await prisma.user.upsert({
        where: {
            id: 2
        },
        update: {},
        create: {
            name: 'elektro',
            email: 'matik.b@centrum.com',
            passwordID: 0
        }
    });

    const adminConsole = await prisma.admin.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            userID: consoleUser.id,
            steamID: 'CONSOLE',
            flags: 15
        }
    });

    const adminMe = await prisma.admin.upsert({
        where: {
            id: 2
        },
        update: {},
        create: {
            userID: meUser.id,
            steamID: 'STEAM_0:1:4515611',
            flags: 15
        }
    });

    const info1 = await prisma.playerInfo.upsert({
        where: {
            id: 1
        },
        update: {
            ip: '192.168.100.5'
        },
        create: {
            name: 'Name1',
            steam2ID: 'STEAM_1:1:611417281',
            steam3ID: '[U:1:1222834563]',
            steamID64: '76561199183100291',
            ip: '192.168.100.5'
        }
    });

    const ban1 = await prisma.ban.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            type: BanType.NORMAL,
            length: 60,
            adminID: adminConsole.id,
            targetInfoID: info1.id,
            reason: 'Reason for ban2'
        }
    });

    const info2 = await prisma.playerInfo.upsert({
        where: {
            id: 2
        },
        update: {},
        create: {
            name: 'TargetName',
            steam2ID: 'STEAM_1:1:123456789',
            steam3ID: '[U:0:321654987]',
            steamID64: '98765432142679',
            ip: '172.17.1.3'
        }
    });

    const ban2 = await prisma.ban.upsert({
        where: {
            id: 2
        },
        update: {},
        create: {
            type: BanType.CT,
            length: 1200,
            adminID: adminMe.id,
            targetInfoID: info2.id,
            reason: 'This is reason for ban2'
        }
    });
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
