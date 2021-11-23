import express from 'express';

import { ErrorGenerator } from '../../Error';
import { Utils } from '../../utils/Utils';
import { TokenRoutes } from '../Routes';
import { TokenManager } from './../../authorization/TokenManager';

export class TokenRouter {
    public constructor() {
        this.mRouter.post(TokenRoutes.POST, async (req, res) => {
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
            if (refreshTokenPayload.userID === undefined || Utils.isFiniteNumber(refreshTokenPayload.userID) ||
                refreshTokenPayload.userCreatedAt === undefined) {
                const error = ErrorGenerator.invalidRefreshToken(req.originalUrl);
                return res.status(error.status).send(error);
            }

            // TODO: Implement
            throw new Error('Not implemented');

            /*const refreshTokenDB = await prisma.refreshToken.findFirst({
                where: {
                    userID: refreshTokenPayload.userID,
                    userCreatedAt: refreshTokenPayload.createdAt
                }
            });

            if (refreshTokenDB == null) {

                return res.sendStatus(401);
            }

            const accessTokenPayload: AccessTokenPayload = {
                userid: refreshTokenPayload.userid,
                createdAt: refreshTokenPayload.createdAt,
                refreshTokenId: refreshTokenDb.id
            };

            const accessToken = generateAccessToken(accessTokenPayload);
            return res.send({ accessToken: accessToken });*/
        });
    }

    public getRouter(): express.Router {
        return this.mRouter;
    }

    private readonly mRouter = express.Router();
}
