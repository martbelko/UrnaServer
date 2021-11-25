import cors from 'cors';
import express, { request } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import passport from 'passport';
import passportSteam from 'passport-steam';

import { UsersRouter } from './routers/Users/Users';
import { AdminsRoutes, AuthRoutes, ServersRoutes, UsersRoutes } from './routers/Routes';
import { AdminsRouter } from './routers/Admins/Admins';
import { TokenRouter } from './routers/Auth/Auth';
import { AccessTokenPayload, RefreshTokenPayload, TokenManager } from './authorization/TokenManager';
import { ErrorGenerator } from './Error';
import { Constants } from './Constants';
import { Middlewares } from './routers/Middlewares';
import { ServersRouter } from './routers/Servers/Servers';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

const steamApiKey = process.env.STEAM_API_KEY;

export class Server {
    public static listen(port: number, callback?: (() => void)): void {
        if (steamApiKey === undefined) {
            throw new Error('env.STEAM_API_KEY is undefined');
        }

        app.enable('trust proxy');
        app.use(express.json());
        app.use(cors());

        app.use(Middlewares.rateLimiter);

        /* PASSPORT JS */
        interface SteamProfile {
            _json: {
                steamid: string;
            }
        }

        passport.serializeUser(function(user, done) {
            done(null, user);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        passport.deserializeUser(function(user: any, done) {
            done(null, user);
        });

        // Setup passport and steam strategy
        passport.use(new passportSteam.Strategy({
            // TODO: Use process.env.IP instead of localhost
            returnURL: 'http://localhost:' + port + AuthRoutes.STEAM_AUTH_RETURN,
            realm: 'http://localhost:' + port + '/',
            apiKey: steamApiKey
        }, function (identifier: string, profile: SteamProfile, done: (arg0: null, arg1: unknown) => unknown) {
            request.user = profile._json.steamid;
            return done(null, profile._json.steamid);
        }
        ));

        app.use(passport.initialize());

        app.get(AuthRoutes.STEAM_AUTH, passport.authenticate('steam', { failureRedirect: AuthRoutes.STEAM_AUTH_FAIL }), function (req, res) {
            return res.redirect(AuthRoutes.STEAM_AUTH_RETURN);
        });

        app.get(AuthRoutes.STEAM_AUTH_RETURN, passport.authenticate('steam', { failureRedirect: AuthRoutes.STEAM_AUTH_FAIL }), async function (req, res) {
            const steamID = req.user as string | undefined;
            if (steamID == undefined) { // Also check for null
                const error = ErrorGenerator.unauthorized(req.originalUrl);
                return res.status(error.status).send(error);
            }

            try {
                await prisma.$transaction(async (prisma) => {
                    const user = await prisma.user.upsert({
                        where: {
                            steamID: steamID
                        },
                        create: {
                            steamID: steamID
                        },
                        update: {
                            steamID: steamID
                        }
                    });

                    const rtp: RefreshTokenPayload = {
                        userID: user.id,
                        userCreatedAt: user.createdAt
                    };

                    const refreshToken = TokenManager.generateRefreshToken(rtp);
                    const refreshTokenDB = await prisma.refreshToken.create({
                        data: {
                            userID: user.id,
                            token: refreshToken,
                            expiresIn: Constants.REFRESH_TOKEN_EXPIRATION
                        }
                    });

                    const atp: AccessTokenPayload = {
                        userID: user.id,
                        userCreatedAt: user.createdAt,
                        refreshTokenID: refreshTokenDB.id
                    };

                    const accessToken = TokenManager.generateAccessToken(atp);
                    return res.send({ accessToken: accessToken, refreshToken: refreshToken });
                });
            } catch (ex) {
                let error = ErrorGenerator.prismaException(ex, req.originalUrl);
                if (error === null) {
                    error = ErrorGenerator.unknownException(req.originalUrl);
                }

                return res.status(error.status).send(error);
            }
        });

        app.get(AuthRoutes.STEAM_AUTH_FAIL, passport.authenticate('steam', { failureRedirect: AuthRoutes.STEAM_AUTH_FAIL }), function (req, res) {
            const error = ErrorGenerator.steamAuthFail(req.originalUrl);
            return res.status(error.status).send(error);
        });

        const userGetRouter = new UsersRouter();
        const adminsRouter = new AdminsRouter();
        const serversRouter = new ServersRouter();
        const tokenRouter = new TokenRouter();

        app.get(UsersRoutes.GET, userGetRouter.getRouter());
        app.patch(UsersRoutes.PATCH, userGetRouter.getRouter());

        app.get(AdminsRoutes.GET, adminsRouter.getRouter());
        app.post(AdminsRoutes.POST, adminsRouter.getRouter());
        app.put(AdminsRoutes.PUT, adminsRouter.getRouter());
        app.delete(AdminsRoutes.DELETE, adminsRouter.getRouter());

        app.get(ServersRoutes.SERVERS_GET, serversRouter.getRouter());
        app.put(ServersRoutes.SERVERS_PUT, serversRouter.getRouter());
        app.post(ServersRoutes.ON_CLIENT_CONNECT_POST, serversRouter.getRouter());

        app.post(AuthRoutes.TOKEN_POST, tokenRouter.getRouter());

        app.listen(port, callback);
    }
}
