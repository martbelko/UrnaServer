import BaseError, { ErrorType } from '../error';
import { maxImmunity, minImmunity, steamidRegex } from '../share';

export function validateSteamID(steamid: string | undefined, paramName: string): BaseError | null {
    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 500;

    if (steamid == undefined) {
        const error: BaseError = {
            type: ErrorType.WasNull,
            title: errorTitle,
            status: errorStatus,
            detail: `Missing ${paramName} parameter`
        };
        return error;
    }

    if (!steamidRegex.test(steamid)) {
        const error: BaseError = {
            type: ErrorType.WasNull,
            title: errorTitle,
            status: errorStatus,
            detail: `Missing ${paramName} parameter`
        };
        return error;
    }

    return null;
}

export function validateFlags(flags: number, paramName: string): BaseError | null {
    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 500;

    if (flags == undefined) {
        const error: BaseError = {
            type: ErrorType.WasNull,
            title: errorTitle,
            status: errorStatus,
            detail: `Missing ${paramName} parameter`
        };
        return error;
    }

    if (isNaN(flags)) {
        const error: BaseError = {
            type: ErrorType.InvalidFlags,
            title: errorTitle,
            status: errorStatus,
            detail: `${paramName} parameter must be a number`
        };
        return error;
    }
    if (flags < 0) {
        const error: BaseError = {
            type: ErrorType.InvalidFlags,
            title: errorTitle,
            status: errorStatus,
            detail: `${paramName} parameter must be greater than 0, but was ${flags}`
        };
        return error;
    }

    return null;
}

export function validateImmunity(immunity: number, paramName: string): BaseError | null {
    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 500;

    if (immunity == undefined) {
        const error: BaseError = {
            type: ErrorType.WasNull,
            title: errorTitle,
            status: errorStatus,
            detail: `Missing ${paramName} parameter`
        };
        return error;
    }

    if (isNaN(immunity)) {
        const error: BaseError = {
            type: ErrorType.WasNull,
            title: errorTitle,
            status: errorStatus,
            detail: `${paramName} parameter must be a number`
        };
        return error;
    }

    if (immunity < minImmunity || immunity > maxImmunity) {
        const error: BaseError = {
            type: ErrorType.WasNull,
            title: errorTitle,
            status: errorStatus,
            detail: `${paramName} parameter must be between ${minImmunity} and ${maxImmunity}, but was ${immunity}`
        };
        return error;
    }

    return null;
}
