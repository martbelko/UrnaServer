export function validateBanType(type: string): string | null {
    if (type == undefined || type == null)
        return 'type was null';

    

    return null;
}

export function validateFlags(flags: number): string | null {
    if (flags == null || flags == undefined)
        return 'Flags was null';
    if (flags < 0)
        return 'Invalid admin flags';

    return null;
}
