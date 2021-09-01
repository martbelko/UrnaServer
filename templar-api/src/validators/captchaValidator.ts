import BaseError, { ErrorType } from '../error';
import fetch from 'isomorphic-fetch';

export async function validateCaptcha(captcha: string | undefined, paramName: string): Promise<BaseError | null> {
    const errorTitle = `Invalid ${paramName} parameter`;
    const errorStatus = 500;

    if (captcha == undefined) {
        const error: BaseError = {
            type: ErrorType.WasNull,
            title: errorTitle,
            status: errorStatus,
            detail: `Missing ${paramName} parameter`
        };
        return error;
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: `secret=6Ld-NDUcAAAAAFgC4AUdMfPn_SvlgLANDdQck8qW&response=${captcha}`
    });

    if (response != null) {
        const json = await response.json();
        const success = json.success as boolean;
        if (!success) {
            const error: BaseError = {
                type: ErrorType.InvalidCaptcha,
                title: 'Invalid captcha',
                status: 400,
                detail: 'Captcha was not satisfied'
            };
            return error;
        }
    }

    return null;
}
