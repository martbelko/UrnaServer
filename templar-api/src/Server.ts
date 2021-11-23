import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import passportSteam from 'passport-steam';
import SteamAPI from 'steamapi';

import { UsersRouter } from './routers/Users/Users';
import { AdminsRoutes, UsersRoutes } from './routers/Routes';
import { AdminsRouter } from './routers/Admins/Admins';

dotenv.config();
const app = express();

const steamApiKey = process.env.STEAM_API_KEY;

export class Server {
    public static listen(port: number, callback?: (() => void)): void {
        if (steamApiKey === undefined){
            throw new Error('env.STEAM_API_KEY is undefined');
        }

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
        app.post(AdminsRoutes.POST, adminsRouter.getRouter());

        const steam = new SteamAPI(steamApiKey);

        // Required to get data from user for sessions
        passport.serializeUser((user, done) => {
            done(null, user);
        });
        passport.deserializeUser((user, done) => {
            done(null, user as any);
        });
        // Initiate Strategy
        passport.use(new passportSteam.Strategy({
            returnURL: 'http://localhost:' + port + '/api/auth/steam/return',
            realm: 'http://localhost:' + port + '/',
            apiKey: steamApiKey
        }, function (identifier: any, profile: { identifier: any; }, done: (arg0: null, arg1: any) => any) {
            process.nextTick(async function () {
                profile.identifier = identifier;
                console.log(profile);
                return done(null, profile);
            });
        }
        ));
        app.use(passport.initialize());

        app.get('/', (req, res) => {
            res.send(req.user);
        });
        app.get('/api/auth/steam', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
            res.redirect('/');
        });
        app.get('/api/auth/steam/return', passport.authenticate('steam', {failureRedirect: '/fail'}), function (req, res) {
            res.redirect('/');
        });

        app.listen(port, callback);
    }
}
