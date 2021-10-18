import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import { createServer } from 'server';

dotenv.config();

const prisma = new PrismaClient();

const app = createServer();
const port = Number(process.env.PORT as string);

async function main() {
    //await prisma.refreshToken.deleteMany();
    app.listen(port, () => console.log(`Listening on port ${port}`));
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
