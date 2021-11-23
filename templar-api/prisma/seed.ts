import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

async function main() {
    await prisma.user.upsert({
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
            }
        }
    });

    await prisma.user.upsert({
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
            csFlags: 3,
            webFlags: 3,
            dcFlags: 3,
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
            csFlags: 16,
            webFlags: 16,
            dcFlags: 16,
            steamID: 'STEAM_0:1:4515611',
            user: {
                connect: {
                    name: 'elektro'
                }
            }
        }
    });

    const info1 = await prisma.banInfo.upsert({
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

    await prisma.ban.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            type: 0,
            length: 60,
            adminID: adminConsole.id,
            banInfoID: info1.id,
            reason: 'Reason for ban2'
        }
    });

    const info2 = await prisma.banInfo.upsert({
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

    await prisma.ban.upsert({
        where: {
            id: 2
        },
        update: {},
        create: {
            type: 1,
            length: 1200,
            adminID: adminMe.id,
            banInfoID: info2.id,
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
