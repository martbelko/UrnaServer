import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import { Constants } from './Constants';
import { TokenManager } from './authorization/TokenManager';
import { Server } from './Server';
import { Utils } from './utils/Utils';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
    const port = Constants.REST_PORT;
    if (!Utils.isFiniteNumber(port) || port === 0) {
        throw new Error('Invalid port');
    }

    TokenManager.init();

    Server.listen(port, () => console.log(`Listening on port ${port}`));
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
