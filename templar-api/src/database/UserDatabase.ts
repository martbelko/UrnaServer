import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserSelectionModel {
    public admin = false;
    public createdAt = false;
    public email = false;
    public emailID = false;
    public id = false;
    public name = false;
    public password = false;
    public passwordID = false;
    public refreshTokens = false;
    public updatedAt = false;
    public vips = false;
}

export class UserDatabase {
    public static async getUserByID(id: number, userSelectionModel: UserSelectionModel = new UserSelectionModel()): Promise<User | null> {
        const user = await prisma.user.findFirst({
            select: userSelectionModel,
            where: {
                id: id
            }
        });

        return user;
    }

    public static async getUserByName(name: string, userSelectionModel: UserSelectionModel = new UserSelectionModel()): Promise<User | null> {
        const user = await prisma.user.findFirst({
            select: userSelectionModel,
            where: {
                name: name
            }
        });

        return user;
    }
}