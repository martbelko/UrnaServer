const steamidRegex = new RegExp(/^STEAM_[0-5]:[01]:\d+$/);

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
    if (flags < 0)
        return 'Invalid admin flags';

    return null;
}
