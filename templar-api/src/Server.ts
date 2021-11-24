import cors from 'cors';
import express, { request } from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import passportSteam from 'passport-steam';

import { UsersRouter } from './routers/Users/Users';
import { AdminsRoutes, UsersRoutes } from './routers/Routes';
import { AdminsRouter } from './routers/Admins/Admins';

dotenv.config();
const app = express();

interface SteamProfile {
    _json: {
        steamid: string;
    }
}

const steamApiKey = process.env.STEAM_API_KEY;

export class Server {
    public static listen(port: number, callback?: (() => void)): void {
        if (steamApiKey === undefined) {
            throw new Error('env.STEAM_API_KEY is undefined');
        }

        app.use(express.json());
        app.use(cors());
        app.enable('trust proxy');

        // Setup passport and steam strategy
        passport.use(new passportSteam.Strategy({
            // TODO: Use process.env.IP instead of localhost
            returnURL: 'http://localhost:' + port + '/api/auth/steam/return',
            realm: 'http://localhost:' + port + '/',
            apiKey: steamApiKey
        }, function (identifier: string, profile: SteamProfile, done: (arg0: null, arg1: unknown) => unknown) {
            request.user = profile._json.steamid;
            return done(null, profile._json.steamid);
        }
        ));

        app.use(passport.initialize());

        const userGetRouter = new UsersRouter();
        const adminsRouter = new AdminsRouter();

        app.get(UsersRoutes.GET, userGetRouter.getRouter());
        app.patch(UsersRoutes.PATCH, userGetRouter.getRouter());

        app.get(AdminsRoutes.GET, adminsRouter.getRouter());
        app.post(AdminsRoutes.POST, adminsRouter.getRouter());

        app.get('/api/auth/steam', passport.authenticate('steam', { failureRedirect: '/api/auth/steam/fail' }), function (req, res) {
            return res.redirect('/api/auth/steam/return');
        });

        app.get('/api/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/api/auth/steam/fail' }), function (req, res) {
            return res.send(req.user);
        });

        app.listen(port, callback);
    }
}
