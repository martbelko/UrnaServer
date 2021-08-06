import BaseError, { ErrorType } from '../error';
import { ipRegex } from '../share';

export function validateIP(ip: string, paramName: string): BaseError | null {
    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 500;

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