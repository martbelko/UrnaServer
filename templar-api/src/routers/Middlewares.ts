import { NextFunction, Request, Response } from 'express';

import { TokenManager } from './../authorization/TokenManager';
import { Utils } from './../utils/Utils';
import { ErrorGenerator } from './../Error';
import { Constants } from './../Constants';

class RateLimiter {
    public constructor(maxLimit: number) {
        this.maxLimit = maxLimit;
        this.mNextReset = Math.ceil(Date.now() / 1000.0) + 60;

        const interval = 1000; // ms
        let expected = Date.now() + interval;
        const step = () => {
            const dt = Date.now() - expected; // the drift (positive for overshooting)
            if (dt > interval) {
                // something really bad happened. Maybe the browser (tab) was inactive?
                // possibly special handling to avoid futile "catch up" run
            }

            if (this.mCurrentElapsedSeconds >= this.durationInSeconds) {
                this.mLimiter.clear();
                this.mCurrentElapsedSeconds = 0;
            } else {
                ++this.mCurrentElapsedSeconds;
            }

            expected += interval;
            setTimeout(step, Math.max(0, interval - dt)); // take into account drift
        };

        setTimeout(step, interval);
    }

    public getResetTimeSinceEpoch(): number {
        return this.mNextReset;
    }

    public getRemainingSecondsBeforeReset(): number {
        return this.durationInSeconds - this.mCurrentElapsedSeconds;
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
    public readonly durationInSeconds = Constants.RATE_LIMITER_DURATION;

    private mLimiter = new Map();
    private mCurrentElapsedSeconds = 0;
    private mNextReset = 0;
}

const rateLimiter = new RateLimiter(Constants.MAX_REQUESTS_PER_DURATION);

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
            return res.status(error.status).send(error);
        }

        return next();
    }
}
