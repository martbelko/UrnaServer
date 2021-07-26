import { BanType } from '@prisma/client';
import BaseError, { ErrorType, NullError } from '../error';

export function validateBanType(type: BanType | undefined, paramName: string): BaseError | null {
    if (type == undefined) {
        return new NullError(paramName);
    }

    return null;
}

export function validateBanLength(lengthStr: string, paramName: string): BaseError | null {
    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 401;

    if (lengthStr == undefined) {
        return new NullError(paramName);
    }

    const length = Number(lengthStr);
    if (isNaN(length)) {
        const error: BaseError = {
            type: ErrorType.InvalidBanLength,
            title: errorTitle,
            status: errorStatus,
            detail: `${paramName} parameter must be a number, but was ${lengthStr}`
        };
        return error;
    }

    if (length < 0) {
        const error: BaseError = {
            type: ErrorType.InvalidBanLength,
            title: errorTitle,
            status: errorStatus,
            detail: `${paramName} parameter must be a greater than 0, but was ${length}`
        };
        return error;
    }

    return null;
}

export function validateBanReason(reason: string, paramName: string): BaseError | null {
    if (reason == undefined) {
        return new NullError(paramName);
    }

    return null;
}

