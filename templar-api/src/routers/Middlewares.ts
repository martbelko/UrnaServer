import { NextFunction, Request, Response } from 'express';

import { TokenManager } from './../authorization/TokenManager';
import { Utils } from './../utils/Utils';
import { ErrorGenerator } from './../Error';
import { Constants } from './../Constants';

class RateLimiter {
    public constructor(maxLimit: number, durationInSeconds: number) {
        this.maxLimit = maxLimit;
        this.durationInSeconds = durationInSeconds;
        this.mNextReset = Math.ceil(Date.now() / 1000.0) + durationInSeconds;

        const durationInMs = durationInSeconds * 1000;

        let expected = Date.now() + durationInMs;
        const step = () => {
            const dt = Date.now() - expected; // the drift (positive for overshooting)

            this.mLimiter.clear();
            this.mNextReset = Math.ceil(Date.now() / 1000.0) + durationInSeconds;

            expected += durationInSeconds;
            setTimeout(step, Math.max(0, durationInMs - dt)); // take into account drift
        };

        setTimeout(step, durationInMs);
    }

    public getResetTimeSinceEpoch(): number {
        return this.mNextReset;
    }

    public getRemainingSecondsBeforeReset(): number {
        return this.mNextReset - Math.ceil(Date.now() / 1000.0);
    }

    public decreaseRemainingRequests(ip: string): boolean {
        const remaining = this.getRemainingRequests(ip);
        if (remaining === 0) {
            return false;
        }

        const used = this.maxLimit - remaining;
        this.mLimiter.set(ip, used + 1);
        return true;
    }

    public getRemainingRequests(ip: string): number {
        const used = this.mLimiter.get(ip);
        if (used === undefined) {
            return this.maxLimit;
        }

        return this.maxLimit - used;
    }

    public readonly maxLimit: number;
    public readonly durationInSeconds: number;

    private mLimiter = new Map();
    private mNextReset = Date.now();
}

const rateLimiter = new RateLimiter(Constants.MAX_REQUESTS_PER_DURATION, Constants.RATE_LIMITER_DURATION);

export class Middlewares {
    public static validateAuthHeader(req: Request, res: Response, next: NextFunction): unknown {
        const authHeader = req.headers.authorization;
        if (authHeader === undefined) {
            const error = ErrorGenerator.missingAuthHeader(req.originalUrl);
            return res.status(error.status).send(error);
        }

        const token = Utils.getTokenFromAuthHeader(authHeader);
        if (token === null) {
            const error = ErrorGenerator.invalidAuthHeader(req.originalUrl);
            return res.status(error.status).send(error);
        }

        const accessTokenPayload = TokenManager.verifyAccessToken(token);
        if (accessTokenPayload === null) {
            const error = ErrorGenerator.expiredAuthHeader(req.originalUrl);
            return res.status(error.status).send(error);
        }

        req.body.tokenPayload = accessTokenPayload;
        return next();
    }

    public static validateDateHeader(req: Request, res: Response, next: NextFunction): unknown {
        const dateHeader = req.headers.date;
        if (dateHeader === undefined) {
            const error = ErrorGenerator.invalidDateHeader(req.originalUrl);
            return res.status(error.status).send(error);
        }

        const requestTime = new Date(dateHeader);
        const serverTime = new Date(Date.now());
        const diff = Utils.dateDiffMs(requestTime, serverTime) / 1000.0;
        if (diff > Constants.MAX_DATE_HEADER_DIFF) {
            const error = ErrorGenerator.invalidDateHeader(req.originalUrl);
            return res.status(error.status).send(error);
        }

        return next();
    }

    public static rateLimiter(req: Request, res: Response, next: NextFunction): unknown {
        function setHeaderValues(ip: string) {
            res.setHeader('X-Rate-Limit-Limit', rateLimiter.maxLimit);
            res.setHeader('X-Rate-Limit-Remaining', rateLimiter.getRemainingRequests(ip));
            res.setHeader('X-Rate-Limit-Reset', rateLimiter.getResetTimeSinceEpoch());
        }

        if (req.ip == undefined) { // Also check null
            const error = ErrorGenerator.invalidIP(req.originalUrl);
            return res.status(error.status).send(error);
        }

        const valid = rateLimiter.decreaseRemainingRequests(req.ip);
        setHeaderValues(req.ip);
        if (!valid) {
            const error = ErrorGenerator.tooManyRequests(req.originalUrl);
            res.setHeader('Retry-At', rateLimiter.getRemainingSecondsBeforeReset());
            return res.status(error.status).send(error);
        }

        return next();
    }
}
