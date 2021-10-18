import BaseError, { ErrorType } from '../error';
import { dateDiff } from './dates';
import { MaximumTimeOffsetSeconds } from '../globals';
import { NextFunction, Request, Response } from 'express';

export function validateDateHeader(req: Request, res: Response, next: NextFunction): void | Response<unknown, Record<string, unknown>> {
    const headerDate = new Date(req.headers['last-modified'] as string);
    if (headerDate.toString() == 'Invalid Date') {
        const error: BaseError = {
            type: ErrorType.InvalidTimestamp,
            title: 'Invalid timestamp',
            status: 401,
            detail: 'Specified timestamp was invalid'
        };

        return res.status(error.status).send({ error: error });
    }

    const timeNow = new Date(Date.now());
    const diffTime = dateDiff(headerDate, timeNow);
    if (diffTime > MaximumTimeOffsetSeconds * 1000) {
        const error: BaseError = {
            type: ErrorType.ExpiredTimestamp,
            title: 'Expired timestamp',
            status: 401,
            detail: `Expired timestamp: Given timestamp ${headerDate} not within ${MaximumTimeOffsetSeconds} seconds of server time ${timeNow}`
        };

        return res.status(error.status).send({ error: error });
    }

    return next();
}

export default validateDateHeader;
