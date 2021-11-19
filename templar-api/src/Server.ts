import cors from 'cors';
import express from 'express';

import { UsersRouter } from './routers/Users/Users';
import { AdminsRoutes, UsersRoutes } from './routers/Routes';
import { AdminsRouter } from './routers/Admins/Admins';

const app = express();

export class Server {
    public static listen(port: number, callback?: (() => void)): void {
        app.use(express.json());
        app.use(cors());
        app.enable('trust proxy');

        const userGetRouter = new UsersRouter();
        const adminsRouter = new AdminsRouter();

        app.get(UsersRoutes.GET, userGetRouter.getRouter());
        app.post(UsersRoutes.POST, userGetRouter.getRouter());
        app.patch(UsersRoutes.PATCH, userGetRouter.getRouter());
        app.delete(UsersRoutes.DELETE, userGetRouter.getRouter());

        app.get(AdminsRoutes.GET, adminsRouter.getRouter());

        app.listen(port, callback);
    }
}
