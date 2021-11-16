import cors from 'cors';
import express from 'express';
import { UsersGetRouter } from './routers/Users/UserGet';
import { UsersRoutes } from './routers/Users/UsersRoutes';

const app = express();

export class Server {
    public static listen(port: number, callback?: (() => void)): void {
        app.use(express.json());
        app.use(cors());
        app.enable('trust proxy');

        const userGetRouter = new UsersGetRouter();

        app.get(UsersRoutes.GET, userGetRouter.getRouter());
        app.listen(port, callback);
    }
}
