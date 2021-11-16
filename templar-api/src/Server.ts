import cors from 'cors';
import express from 'express';

const app = express();

export class Server {
    public static listen(port: number, callback?: (() => void)): void {
        app.use(express.json());
        app.use(cors());
        app.enable('trust proxy');

        app.listen(port, callback);
    }
}
