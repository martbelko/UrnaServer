import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';

export interface BaseError {
    type: string; // /errors/incorrect-user-pass
    title: string; // Incorrect username or password.
    status: number; // 404
    detail: string; // Authentication failed due to incorrect username or password.
}

export class NullError implements BaseError {
    type = ErrorType.WasNull;
    title = '';
    status = 500;
    detail = '';

    constructor(paramName: string) {
        this.title = `Invalid ${paramName} parameter`;
        this.detail = `Missing ${paramName} parameter`;
    }
}

export enum ErrorType {
    WasNull = '/errors/null',
    InvalidID = '/errors/invalid-id',
    InvalidPassword = '/errors/invalid-password',
    PasswordsMismatch = '/errors/passwords-mismatch',
    InvalidUsername = '/errors/invalid-username',
    InvalidEmail = '/errors/invalid-email',
    InvalidIp = '/errors/invalid-ip',
    InvalidSteamid = '/errors/invalid-steamid',
    InvalidFlags = '/errors/invalid-flags',
    InvalidImmunity = '/errors/invalid-immunity',
    InvalidBanType = '/errors/invalid-ban-type',
    InvalidBanLength = '/errors/invalid-ban-length',
    InvalidBanReason = '/errors/invalid-ban-reason',
    InvalidVipMode = '/errors/invalid-vip-mode',
    PrismaClientInitializationError = '/errors/prisma-clien-initialization',
    PrismaClientKnownRequestError = '/errors/prisma-client-known-request',
    PrismaClientRustPanicError = '/errors/prisma-client-rust-panic',
    PrismaClientValidationError = '/errors/prisma-client-validation',
    PrismaClientUnknownRequestError = '/errors/prisma-client-unknown-request',
    UnknownExceptionError = '/errors/unknown-exception',
    InvalidTimestamp = '/errors/invalid-timestamp',
    ExpiredTimestamp = '/errors/expired-timestamp'
}

export function generateErrorFromPrismaException(e: unknown): BaseError {
    if (e instanceof PrismaClientInitializationError) {
        const error: BaseError = {
            type: ErrorType.PrismaClientInitializationError,
            title: e.name,
            status: 400,
            detail: e.message
        };
        return error;
    }

    if (e instanceof PrismaClientKnownRequestError) {
        const error: BaseError = {
            type: ErrorType.PrismaClientKnownRequestError,
            title: e.name,
            status: 400,
            detail: e.message
        };
        return error;
    }

    if (e instanceof PrismaClientRustPanicError) {
        const error: BaseError = {
            type: ErrorType.PrismaClientRustPanicError,
            title: e.name,
            status: 400,
            detail: e.message
        };
        return error;
    }

    if (e instanceof PrismaClientValidationError) {
        const index = e.message.search('\n\nArgument flags:') + 2;
        const message = e.message.substring(index, e.message.length - 2);
        const error: BaseError = {
            type: ErrorType.PrismaClientValidationError,
            title: e.name,
            status: 400,
            detail: message
        };
        return error;
    }

    if (e instanceof PrismaClientUnknownRequestError) {
        const error: BaseError = {
            type: ErrorType.PrismaClientUnknownRequestError,
            title: e.name,
            status: 400,
            detail: e.message
        };
        return error;
    }

    const error: BaseError = {
        type: ErrorType.UnknownExceptionError,
        title: 'Unknown exception error',
        status: 400,
        detail: 'No detail'
    };
    return error;
}

export default BaseError;
