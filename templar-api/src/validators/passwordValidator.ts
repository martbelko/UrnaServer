import BaseError, { ErrorType, NullError } from '../error';

import { minPasswordLen, maxPasswordLen } from '../share';

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

export function validatePassword(password: string | undefined, paramName: string): BaseError | null {
    if (password == undefined) {
        return new NullError(paramName);
    }

    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 500;

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
            detail: 'Password does not contain capital letter, lower letter or number'
        };
        return error;
    }

    if (!containsNumber(password)) {
        const error: BaseError = {
            type: ErrorType.InvalidPassword,
            title: errorTitle,
            status: errorStatus,
            detail: 'Password does not contain capital letter, lower letter or number'
        };
        return error;
    }

    if (!containsLower(password)) {
        const error: BaseError = {
            type: ErrorType.InvalidPassword,
            title: errorTitle,
            status: errorStatus,
            detail: 'Password does not contain capital letter, lower letter or number'
        };
        return error;
    }

    return null;
}
