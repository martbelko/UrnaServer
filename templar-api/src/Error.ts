import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';

export interface Error {
    error: ErrorID;
    title: ErrorTitle;
    status: StatusCode;
    detail: string;
    instance: string;
}

export enum ErrorID {
    FORBIDDEN = 'forbidden',

    MISSING_BODY_PARAMETER = 'missing-body-parameter',
    MISSING_URL_PARAMETER = 'missing-url-parameter',
    MISSING_QUERY_PARAMETER = 'missing-query-parameter',

    INVALID_BODY_PARAMETER = 'invalid-body-parameter',
    INVALID_URL_PARAMETER = 'invalid-url-parameter',
    INVALID_QUERY_PARAMETER = 'invalid-query-parameter',

    NO_AUTH_HEADER = 'missing-auth-header',
    INVALID_AUTH_HEADER = 'invalid-auth-header',
    AUTH_TOKEN_EXPIRED = 'auth-token-expired',

    UNKNOWN_EXCEPTION_ERROR = 'unknown-exception-error',

    // PRISMA
    PRISMA_CLIENT_INITIALIZATION_ERROR = 'prisma-client-initialization-error',
    PRISMA_CLIENT_KNOWN_REQUEST_ERROR = 'prisma-client-known-request-error',
    PRISMA_CLIENT_RUST_PANIC_ERROR = 'prisma-client-rust-panic-error',
    PRISMA_CLIENT_VALIDATION_ERROR = 'prisma-client-validation-error',
    PRISMA_CLIENT_UNKNOWN_REQUEST_ERROR = 'prisma-client-unknown-request-error'
}

export enum ErrorTitle {
    FORBIDDEN = 'Forbidden',

    MISSING_BODY_PARAMETER = 'Missing body parameter',
    MISSING_URL_PARAMETER = 'Missing URL parameter',
    MISSING_QUERY_PARAMETER = 'Missing query parameter',

    INVALID_BODY_PARAMETER = 'Invalid body parameter',
    INVALID_URL_PARAMETER = 'Invalid URL parameter',
    INVALID_QUERY_PARAMETER = 'Invalid query parameter',

    NO_AUTH_HEADER = 'Mising auth header',
    INVALID_AUTH_HEADER = 'Invalid auth header',
    AUTH_TOKEN_EXPIRED = 'Authorization token expired',

    UNKNOWN_EXCEPTION_ERROR = 'Unknown excepction error',

    // Prisma
    PRISMA_CLIENT_INITIALIZATION_ERROR = 'Prisma Client initialization error',
    PRISMA_CLIENT_KNOWN_REQUEST_ERROR = 'Prisma Client known request error',
    PRISMA_CLIENT_RUST_PANIC_ERROR = 'Prisma Client rust panic error',
    PRISMA_CLIENT_VALIDATION_ERROR = 'Prisma Client validation error',
    PRISMA_CLIENT_UNKNOWN_REQUEST_ERROR = 'Prisma Client unknown request error'
}

export enum StatusCode {
    OK = 200, // The request was successfully completed.
    CREATED = 201, // A new resource was successfully created.

    BAD_REQUEST = 400, // The request was invalid.
    UNAUTHORIZED = 401, // The request did not include an authentication token or the authentication token was expired.
    FORBIDDEN = 403, // The client did not have permission to access the requested resource.
    NOT_FOUND = 404, // The requested resource was not found.
    METHOD_NOT_ALLOWED = 405, // The HTTP method in the request was not supported by the resource. For example, the DELETE method cannot be used with the Agent API.
    CONFLICT = 409, // The request could not be completed due to a conflict. For example,  POST ContentStore Folder API cannot complete if the given file or folder name already exists in the parent location.
    PRECONDITION_FAILED = 412, // One or more conditions in the request header fields evaluated to false.

    INTERNAL_SERVER_ERROR = 500, // The request was not completed due to an internal error on the server side.
    SERVICE_UNAVAILABLE = 503 // The server was unavailable.
}

export class ErrorGenerator {
    public static forbidden(instance: string): Error {
        const error: Error = {
            error: ErrorID.FORBIDDEN,
            title: ErrorTitle.FORBIDDEN,
            status: StatusCode.FORBIDDEN,
            detail: 'Requested resource was forbidden',
            instance: instance
        };
        return error;
    }

    public static missingAuthHeader(instance: string): Error {
        const error: Error = {
            error: ErrorID.NO_AUTH_HEADER,
            title: ErrorTitle.NO_AUTH_HEADER,
            status: StatusCode.UNAUTHORIZED,
            detail: 'Missing authorization header',
            instance: instance
        };
        return error;
    }

    public static invalidAuthHeader(instance: string): Error {
        const error: Error = {
            error: ErrorID.INVALID_AUTH_HEADER,
            title: ErrorTitle.INVALID_AUTH_HEADER,
            status: StatusCode.UNAUTHORIZED,
            detail: 'Invalid authorization header',
            instance: instance
        };
        return error;
    }

    public static expiredAuthHeader(instance: string): Error {
        const error: Error = {
            error: ErrorID.AUTH_TOKEN_EXPIRED,
            title: ErrorTitle.AUTH_TOKEN_EXPIRED,
            status: StatusCode.UNAUTHORIZED,
            detail: 'Authorization token is expired',
            instance: instance
        };
        return error;
    }

    public static missingBodyParameter(param: string, instance: string): Error {
        const error: Error = {
            error: ErrorID.MISSING_BODY_PARAMETER,
            title: ErrorTitle.MISSING_BODY_PARAMETER,
            status: StatusCode.BAD_REQUEST,
            detail: `Missing '${param}' parameter`,
            instance: instance
        };
        return error;
    }

    public static missingUrlParameter(param: string, instance: string): Error {
        const error: Error = {
            error: ErrorID.MISSING_URL_PARAMETER,
            title: ErrorTitle.MISSING_URL_PARAMETER,
            status: StatusCode.BAD_REQUEST,
            detail: `Missing '${param}' parameter`,
            instance: instance
        };
        return error;
    }

    public static missingQueryParameter(param: string, instance: string): Error {
        const error: Error = {
            error: ErrorID.MISSING_QUERY_PARAMETER,
            title: ErrorTitle.MISSING_QUERY_PARAMETER,
            status: StatusCode.BAD_REQUEST,
            detail: `Missing '${param}' parameter`,
            instance: instance
        };
        return error;
    }

    public static invalidBodyParameter(param: string, instance: string): Error {
        const error: Error = {
            error: ErrorID.INVALID_BODY_PARAMETER,
            title: ErrorTitle.INVALID_BODY_PARAMETER,
            status: StatusCode.BAD_REQUEST,
            detail: `Invalid '${param}' parameter`,
            instance: instance
        };
        return error;
    }

    public static invalidUrlParameter(param: string, instance: string): Error {
        const error: Error = {
            error: ErrorID.INVALID_URL_PARAMETER,
            title: ErrorTitle.INVALID_URL_PARAMETER,
            status: StatusCode.BAD_REQUEST,
            detail: `Invalid '${param}' parameter`,
            instance: instance
        };
        return error;
    }

    public static invalidQueryParameter(param: string, instance: string): Error {
        const error: Error = {
            error: ErrorID.INVALID_QUERY_PARAMETER,
            title: ErrorTitle.INVALID_QUERY_PARAMETER,
            status: StatusCode.BAD_REQUEST,
            detail: `Invalid '${param}' parameter`,
            instance: instance
        };
        return error;
    }

    public static unknownException(instance: string): Error {
        const error: Error = {
            error: ErrorID.UNKNOWN_EXCEPTION_ERROR,
            title: ErrorTitle.UNKNOWN_EXCEPTION_ERROR,
            status: StatusCode.INTERNAL_SERVER_ERROR,
            detail: 'Unknown exception error',
            instance: instance
        };
        return error;
    }

    public static prismaException(ex: unknown, instance: string): Error | null {
        if (ex instanceof PrismaClientInitializationError) {
            const error: Error = {
                error: ErrorID.PRISMA_CLIENT_INITIALIZATION_ERROR,
                title: ErrorTitle.PRISMA_CLIENT_INITIALIZATION_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR,
                detail: `${ex.errorCode} ${ex.name}: ${ex.message}`,
                instance: instance
            };
            return error;
        }

        if (ex instanceof PrismaClientKnownRequestError) {
            const error: Error = {
                error: ErrorID.PRISMA_CLIENT_KNOWN_REQUEST_ERROR,
                title: ErrorTitle.PRISMA_CLIENT_KNOWN_REQUEST_ERROR,
                status: StatusCode.CONFLICT,
                detail: `${ex.code} ${ex.name}: ${ex.message}`,
                instance: instance
            };
            return error;
        }

        if (ex instanceof PrismaClientRustPanicError) {
            const error: Error = {
                error: ErrorID.PRISMA_CLIENT_RUST_PANIC_ERROR,
                title: ErrorTitle.PRISMA_CLIENT_RUST_PANIC_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR,
                detail: `${ex.name}: ${ex.message}`,
                instance: instance
            };
            return error;
        }

        if (ex instanceof PrismaClientValidationError) {
            const index = ex.message.search('\n\nArgument flags:') + 2;
            const message = ex.message.substring(index, ex.message.length - 2);
            const error: Error = {
                error: ErrorID.PRISMA_CLIENT_VALIDATION_ERROR,
                title: ErrorTitle.PRISMA_CLIENT_VALIDATION_ERROR,
                status: StatusCode.CONFLICT,
                detail: `${ex.name}: ${message}`,
                instance: instance
            };
            return error;
        }

        if (ex instanceof PrismaClientUnknownRequestError) {
            const error: Error = {
                error: ErrorID.PRISMA_CLIENT_UNKNOWN_REQUEST_ERROR,
                title: ErrorTitle.PRISMA_CLIENT_UNKNOWN_REQUEST_ERROR,
                status: 400,
                detail: ex.message,
                instance: instance
            };
            return error;
        }

        return null;
    }
}
