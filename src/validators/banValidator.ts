export function validateBanType(type: string): string | null {
    if (type == undefined || type == null)
        return 'type was null';
    return null;
}
