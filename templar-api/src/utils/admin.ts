import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function isAdmin(userid: number): Promise<boolean> {
    const admin = await prisma.admin.findFirst({
        where: {
            userID: userid
        }
    });

    return admin != null;
}