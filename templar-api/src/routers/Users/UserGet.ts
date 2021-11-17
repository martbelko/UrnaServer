import { StatusCode } from './../../Error';
import express, { Request } from 'express';

import { UsersRoutes } from './../Users/UsersRoutes';
import { Middlewares } from './../Middlewares';

class UserGet {
    constructor(req: Request) {
        this.id = Number(req.query.id as string);
        this.name = req.query.name as string;
        this.email = req.query.email as string;

        this.sortBy = req.query.sortBy as string;
    }

    public readonly id: number;
    public readonly name: string;
    public readonly email: string;
    public readonly sortBy: string;
}

export class UsersGetRouter {
    public constructor() {
        this.mRouter.get(UsersRoutes.GET, Middlewares.validateAuthHeader, async (req, res) => {
            const queryUser = new UserGet(req);
            return res.status(StatusCode.OK).send(queryUser);
        });
    }

    public getRouter(): express.Router {
        return this.mRouter;
    }

    private readonly mRouter = express.Router();
}
