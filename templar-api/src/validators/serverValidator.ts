import BaseError, { ErrorType } from '../error';

const ipRegex = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);

export function validateIP(ip: string, paramName: string): BaseError | null {
    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 401;

    if (ip == undefined) {
        const error: BaseError = {
            type: ErrorType.WasNull,
            title: errorTitle,
            status: errorStatus,
            detail: `Missing ${paramName} parameter`
        };
        return error;
    }

    if (!ipRegex.test(ip)) {
        const error: BaseError = {
            type: ErrorType.InvalidIp,
            title: errorTitle,
            status: errorStatus,
            detail: `${paramName} parameter is not valid IP address`
        };
        return error;
    }

    return null;
}