import express from 'express';
import { PrismaClient } from '@prisma/client';

import { UsersRoutes } from 'routers/Users/UsersRoutes';

const prisma = new PrismaClient();

interface UserGet {
    id: number | undefined;
    name: string | undefined;
    email: string | undefined;
}

export class UsersGetRouter {
    public constructor() {
        this.mRouter.get(UsersRoutes.GET, async (req, res) => {
            const user: UserGet = {
                id: Number(req.query.id as string),
                name: req.query.name as string,
                email: req.query.email as string
            };
        });
    }

    public getRouter(): express.Router {
        return this.mRouter;
    }

    private readonly mRouter = express.Router();
}
