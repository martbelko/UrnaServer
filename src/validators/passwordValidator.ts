const minPasswordLen = 8;
const maxPasswordLen = 100;

const allowedPasswordChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890/*\\-=,.[]|';

function containsCapital(str: string): boolean {
    const capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const ch of str) {
        if (capitals.includes(ch))
            return true;
    }

    return false;
}

function containsNumber(str: string): boolean {
    const numbers = '0123456789';
    for (const ch of str) {
        if (numbers.includes(ch))
            return true;
    }

    return false;
}

function containsLower(str: string): boolean {
    const lower = 'abcdefghijklmnopqrtsuvwxyz';
    for (const ch of str) {
        if (lower.includes(ch))
            return true;
    }

    return false;
}

export function validatePassword(password: string): string | null {
    if (password == undefined || password == null)
        return 'Password was null';
    if (password.length < minPasswordLen)
        return `Password needs to contain at least ${minPasswordLen} characters. Contains: ${password.length}`;
    if (password.length > maxPasswordLen)
        return `Password needs to contain maximum ${maxPasswordLen} characters. Contains: ${password.length}`;

    if (!containsCapital(password))
        return 'Password does not contain capital letter';
    if (!containsNumber(password))
        return 'Password does not contain number';
    if (!containsLower(password))
        return 'Password does not contain lower letter';

    for (const ch of password) {
        if (!allowedPasswordChars.includes(ch))
            return `Password contain invalid char '${ch}'`;
    }

    return null;
}
