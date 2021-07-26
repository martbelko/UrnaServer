import BaseError, { ErrorType } from '../error';

const steamidRegex = new RegExp(/^STEAM_[0-5]:[01]:\d+$/);

const minImmunity = 0;
const maxImmunity = 100;

export function validateSteamID(steamid: string, paramName: string): BaseError | null {
    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 401;

    if (steamid == undefined || steamid == null)
        return {
            type: ErrorType.WasNull,
            title: errorTitle,
            status: errorStatus,
            detail: `Missing ${paramName} parameter`
        };

    if (!steamidRegex.test(steamid))
        return {
            type: ErrorType.InvalidSteamid,
            title: errorTitle,
            status: errorStatus,
            detail: `${paramName} parameter is an invalid steamID`
        };

    return null;
}

export function validateFlags(flags: number, paramName: string): BaseError | null {
    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 401;

    if (flags == null || flags == undefined) {
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
    const errorStatus = 401;

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
