import BaseError, { ErrorType, NullError } from '../error';

const minUserNameLen = 6;
const maxUserNameLen = 100;

const allowedNameChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

// eslint-disable-next-line no-useless-escape
const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export function validateUserName(name: string, paramName: string): BaseError | null {
    if (name == undefined || name == null) {
        return new NullError(paramName);
    }

    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 500;
    if (name.length < minUserNameLen) {
        const error: BaseError = {
            type: ErrorType.InvalidUsername,
            title: errorTitle,
            status: errorStatus,
            detail: `${paramName} parameter needs to contain at least ${minUserNameLen} characters, but contains: ${name.length}`
        };
        return error;
    }

    if (name.length > maxUserNameLen) {
        const error: BaseError = {
            type: ErrorType.InvalidUsername,
            title: errorTitle,
            status: errorStatus,
            detail: `${paramName} parameter needs to contain maximum ${maxUserNameLen} characters, but contains: ${name.length}`
        };
        return error;
    }

    for (const ch of name) {
        if (!allowedNameChars.includes(ch)) {
            const error: BaseError = {
                type: ErrorType.InvalidUsername,
                title: errorTitle,
                status: errorStatus,
                detail: `${paramName} parameter contains invalid char '${ch}'`
            };
            return error;
        }
    }

    return null;
}

export function validateUserEmail(email: string, paramName: string): BaseError | null {
    if (email == undefined || email == null) {
        return new NullError(paramName);
    }

    if (!emailRegex.test(email)) {
        const error: BaseError = {
            type: ErrorType.InvalidEmail,
            title: `Invalid ${paramName} parameter`,
            status: 500,
            detail: `${paramName} parameter is invalid email`
        };
        return error;
    }

    return null;
}
