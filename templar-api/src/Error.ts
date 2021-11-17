export interface Error {
    error: ErrorID;
    title: ErrorTitle;
    status: StatusCode;
    detail: string;
    instance: string;
}

export enum ErrorID {
    INVALID_ID_FIELD = 'invalid-id-parameter',
    INVALID_NAME_FIELD = 'invalid-id-parameter',
    INVALID_EMAIL_FIELD = 'invalid-id-parameter',

    NO_AUTH_HEADER = 'missing-auth-header',
    INVALID_AUTH_HEADER = 'invalid-auth-header',
    AUTH_TOKEN_EXPIRED = 'auth-token-expired'
}

export enum ErrorTitle {
    INVALID_ID_FIELD = 'Invalid \'id\' parameter',
    INVALID_NAME_FIELD = 'Invalid \'name\' parameter',
    INVALID_EMAIL_FIELD = 'Invalid \'email\' parameter',

    NO_AUTH_HEADER = 'Mising auth header',
    INVALID_AUTH_HEADER = 'Invalid auth header',
    AUTH_TOKEN_EXPIRED = 'Authorization token expired'
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
}
