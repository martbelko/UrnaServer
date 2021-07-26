import BaseError, { ErrorType, NullError } from '../error';

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

export function validatePassword(password: string, paramName: string): BaseError | null {
    if (password == undefined || password == null) {
        return new NullError(paramName);
    }

    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 401;

    if (password.length < minPasswordLen) {
        const error: BaseError = {
            type: ErrorType.InvalidPassword,
            title: errorTitle,
            status: errorStatus,
            detail: `Password needs to contain at least ${minPasswordLen} characters`
        };
        return error;
    }

    if (password.length > maxPasswordLen) {
        const error: BaseError = {
            type: ErrorType.InvalidPassword,
            title: errorTitle,
            status: errorStatus,
            detail: `Password needs to contain maximum ${maxPasswordLen} characters`
        };
        return error;
    }

    if (!containsCapital(password)) {
        const error: BaseError = {
            type: ErrorType.InvalidPassword,
            title: errorTitle,
            status: errorStatus,
            detail: 'Password does not contain capital letter'
        };
        return error;
    }

    if (!containsNumber(password)) {
        const error: BaseError = {
            type: ErrorType.InvalidPassword,
            title: errorTitle,
            status: errorStatus,
            detail: 'Password does not contain number'
        };
        return error;
    }

    if (!containsLower(password)) {
        const error: BaseError = {
            type: ErrorType.InvalidPassword,
            title: errorTitle,
            status: errorStatus,
            detail: 'Password does not contain lower letter'
        };
        return error;
    }

    for (const ch of password) {
        if (!allowedPasswordChars.includes(ch)) {
            const error: BaseError = {
                type: ErrorType.InvalidPassword,
                title: errorTitle,
                status: errorStatus,
                detail: 'Password contain invalid character'
            };
            return error;
        }
    }

    return null;
}
