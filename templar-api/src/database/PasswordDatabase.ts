import { PrismaClient, Password } from '@prisma/client';

const prisma = new PrismaClient();

export class PasswordSelectionModel {
    id = true;
    password = false;
    salt = false;
    users = false;
}

export class PasswordDatabase {
    public static async getPasswordByID(id: number, passwordSelectionModel: PasswordSelectionModel = new PasswordSelectionModel()): Promise<Password | null> {
        const password = await prisma.password.findFirst({
            select: passwordSelectionModel,
            where: {
                id: id
            }
        });

        return password;
    }
}