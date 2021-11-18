import { TokenManager } from './../authorization/TokenManager';
import { NextFunction, Request, Response } from 'express';
import { Utils } from './../utils/Utils';
import { ErrorGenerator } from './../Error';

export class Middlewares {
    public static validateAuthHeader(req: Request, res: Response, next: NextFunction): unknown {
        const authHeader = req.headers.authorization;
        if (authHeader == undefined) {
            const error = ErrorGenerator.missingAuthHeader(req.originalUrl);
            return res.status(error.status).send(error);
        }

        const token = Utils.getTokenFromAuthHeader(authHeader);
        if (token == null) {
            const error = ErrorGenerator.invalidAuthHeader(req.originalUrl);
            return res.status(error.status).send(error);
        }

        const accessTokenPayload = TokenManager.verifyAccessToken(token);
        if (accessTokenPayload == null) {
            const error = ErrorGenerator.expiredAuthHeader(req.originalUrl);
            return res.status(error.status).send(error);
        }

        req.body.tokenPayload = accessTokenPayload;
        next();
    }
}
