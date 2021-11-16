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
            email: {
                create: {
                    email: 'martbelko@gmail.com',
                    verified: true
                }
            },
            password: {
                create: {
                    password: 0,
                    salt: 'a'
                }
            }
        }
    });

    const meUser = await prisma.user.upsert({
        where: {
            id: 2
        },
        update: {},
        create: {
            name: 'elektro',
            email: {
                create: {
                    email: 'matik.b@centrum.com',
                    verified: true
                }
            },
            password: {
                create: {
                    password: 1,
                    salt: 'b'
                }
            }
        }
    });

    const adminConsole = await prisma.admin.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            immunity: 5,
            flags: 3,
            steamID: 'CONSOLE',
            user: {
                connect: {
                    name: 'CONSOLE'
                }
            }
        }
    });

    const adminMe = await prisma.admin.upsert({
        where: {
            id: 2
        },
        update: {},
        create: {
            immunity: 99,
            flags: 16,
            steamID: 'STEAM_0:1:4515611',
            user: {
                connect: {
                    name: 'elektro'
                }
            }
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
