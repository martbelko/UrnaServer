import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import { Constants } from './Constants';
import { Server } from './Server';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
    const port = Constants.REST_PORT;
    if (isNaN(port) || !isFinite(port) || port == 0) {
        throw new Error('Invalid port');
    }

    Server.listen(port, () => console.log(`Listening on port ${port}`));
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });