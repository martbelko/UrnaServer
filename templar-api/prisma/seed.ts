import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';

import { CSFlag, DiscordFlag, WebFlag } from './../src/AdminFlags';
import { Constants } from './../src/Constants';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

async function main() {
    const user = await prisma.user.upsert({
        where: {
            id: 1
        },
        create: {
            steamID: '76561199008632307'
        },
        update: {
            steamID: '76561199008632307'
        }
    });

    function getMaxFlags(enumLen: number): number {
        return Math.pow(2, enumLen) - 1;
    }

    const csFlagsLen = Object.keys(CSFlag).length / 2;
    const webFlagsLen = Object.keys(WebFlag).length / 2;
    const dcFlagsLen = Object.keys(DiscordFlag).length / 2;

    await prisma.admin.upsert({
        where: {
            userID: user.id
        },
        create: {
            userID: user.id,
            nickname: 'elektro',
            csFlags: getMaxFlags(csFlagsLen),
            webFlags: getMaxFlags(webFlagsLen),
            dcFlags: getMaxFlags(dcFlagsLen),
            immunity: Constants.MAX_IMMUNITY
        },
        update: {
            userID: user.id,
            nickname: 'elektro',
            csFlags: getMaxFlags(csFlagsLen),
            webFlags: getMaxFlags(webFlagsLen),
            dcFlags: getMaxFlags(dcFlagsLen),
            immunity: Constants.MAX_IMMUNITY
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
