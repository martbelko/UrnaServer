import BaseError, { ErrorType } from '../error';

const steamidRegex = new RegExp(/^STEAM_[0-5]:[01]:\d+$/);

const minImmunity = 0;
const maxImmunity = 100;

export function validateSteamID(steamid: string, paramName: string): BaseError | null {
    if (steamid == undefined || steamid == null)
        return {
            type: ErrorType.WasNull,
            title: `Missing ${paramName} parameter`,
            status: 1,
            detail: `Missing ${paramName} parameter`
        };

    if (!steamidRegex.test(steamid))
        return {
            type: ErrorType.InvalidSteamid,
            title: `Invalid ${paramName} parameter`,
            status: 401,
            detail: `${paramName} parameter is an invalid steamID`
        };

    return null;
}

export function validateFlags(flags: number): string | null {
    if (flags == null || flags == undefined)
        return 'Flags was null';
    if (isNaN(flags)) {
        return 'Flags must be a number';
    }
    if (flags < 0)
        return 'Invalid admin flags';

    return null;
}

export function validateImmunity(immunity: number): string | null {
    if (immunity == undefined) {
        return 'Immunity was null';
    }

    if (isNaN(immunity)) {
        return 'Immunity must be a number';
    }

    if (immunity < minImmunity || immunity > maxImmunity) {
        return `Immunity must be between ${minImmunity} and ${maxImmunity}, but was ${immunity}`;
    }

    return null;
}
