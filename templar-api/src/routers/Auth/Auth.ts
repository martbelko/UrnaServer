import express from 'express';
import { PrismaClient } from '@prisma/client';

import { ErrorGenerator } from '../../Error';
import { AuthRoutes } from '../Routes';
import { AccessTokenPayload, TokenManager } from '../../authorization/TokenManager';
import { Utils } from './../../utils/Utils';

const prisma = new PrismaClient();

export class TokenRouter {
    public constructor() {
        this.mRouter.post(AuthRoutes.TOKEN_POST, async (req, res) => { // Generate new access token
            const refreshToken = req.body.refreshToken as string;
            if (refreshToken === undefined) {
                const error = ErrorGenerator.missingBodyParameter('refreshToken', req.originalUrl);
                return res.status(error.status).send(error);
            }

            const refreshTokenPayload = TokenManager.verifyRefreshToken(refreshToken);
            if (refreshTokenPayload === null) {
                const error = ErrorGenerator.invalidRefreshToken(req.originalUrl);
                return res.status(error.status).send(error);
            }

            // Should not happen, but check anyway
            if (refreshTokenPayload.userID === undefined || !Utils.isFiniteNumber(refreshTokenPayload.userID) ||
                refreshTokenPayload.userCreatedAt === undefined) {
                const error = ErrorGenerator.invalidRefreshToken(req.originalUrl);
                return res.status(error.status).send(error);
            }

            try {
                const refreshTokenDB = await prisma.refreshToken.findFirst({
                    where: {
                        user: {
                            id: refreshTokenPayload.userID,
                            createdAt: refreshTokenPayload.userCreatedAt
                        }
                    }
                });

                if (refreshTokenDB === null) {
                    const error = ErrorGenerator.invalidRefreshToken(req.originalUrl);
                    return res.status(error.status).send(error);
                }

                const accessTokenPayload: AccessTokenPayload = {
                    userID: refreshTokenPayload.userID,
                    userCreatedAt: refreshTokenPayload.userCreatedAt,
                    refreshTokenID: refreshTokenDB.id
                };

                const accessToken = TokenManager.generateAccessToken(accessTokenPayload);
                return res.send({ accessToken: accessToken });
            } catch (ex) {
                let error = ErrorGenerator.prismaException(ex, req.originalUrl);
                if (error === null) {
                    error = ErrorGenerator.unknownException(req.originalUrl);
                }

                return res.status(error.status).send(error);
            }
        });
    }

    public getRouter(): express.Router {
        return this.mRouter;
    }

    private readonly mRouter = express.Router();
}
