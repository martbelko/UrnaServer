import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';

export interface BaseError {
    type: string; // /errors/incorrect-user-pass
    title: string; // Incorrect username or password.
    status: number; // 404
    detail: string; // Authentication failed due to incorrect username or password.
}

export enum ErrorType {
    WasNull = '/errors/null',
    InvalidPassword = '/errors/invalid-password',
    InvalidUsername = '/errors/invalid-username',
    InvalidEmail = '/errors/invalid-email',
    InvalidIp = '/errors/invalid-ip',
    InvalidSteamid = '/errors/invalid-steamid',
    InvalidFlags = '/errors/invalid-flags',
    InvalidImmunity = '/errors/invalid-immunity',
    InvalidBanType = '/errors/invalid-ban-type',
    PrismaClientInitializationError = '/errors/prisma-clien-initialization',
    PrismaClientKnownRequestError = '/errors/prisma-client-known-request',
    PrismaClientRustPanicError = '/errors/prisma-client-rust-panic',
    PrismaClientValidationError = '/errors/prisma-client-validation',
    PrismaClientUnknownRequestError = '/errors/prisma-client-unknown-request',
    UnknownExceptionError = '/errors/unknown-exception'
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
