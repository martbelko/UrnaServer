const steamidRegex = new RegExp(/^STEAM_[0-5]:[01]:\d+$/);

const minImmunity = 0;
const maxImmunity = 100;

export function validateSteamID(steamid: string): string | null {
    if (steamid == undefined || steamid == null)
        return 'SteamID was null';

    if (!steamidRegex.test(steamid))
        return 'Invalid steamid';

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
