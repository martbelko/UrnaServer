import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError,
    PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';

export interface Error {
    error: ErrorID;
    title: ErrorTitle;
    status: StatusCode;
    detail: string;
    instance: string;
}

export enum ErrorID {
    FORBIDDEN = 'forbidden',

    INVALID_REFRESH_TOKEN = 'invalid-refresh-token',

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

    INVALID_REFRESH_TOKEN = 'Invalid refresh token',

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
    CONTINUE = 100, // This interim response indicates that the client should continue the request or ignore the response if the request is already finished.
    SWITCHING_PROTOCOLS = 101, // This code is sent in response to an Upgrade request header from the client and indicates the protocol the server is switching to.
    EARLY_HINTS = 103, // This status code is primarily intended to be used with the Link header, letting the user agent start preloading resources while the server prepares a response.

    OK = 200, // The request was successfully completed.
    CREATED = 201, // A new resource was successfully created.
    ACCEPTED = 202, // The request has been received but not yet acted upon. It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. It is intended for cases where another process or server handles the request, or for batch processing.
    NON_AUTHORITATIVE_INFORMATION = 203, // This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy. This is mostly used for mirrors or backups of another resource. Except for that specific case, the 200 OK response is preferred to this status.
    NO_CONTENT = 204, // There is no content to send for this request, but the headers may be useful. The user agent may update its cached headers for this resource with the new ones.
    RESET_CONTENT = 205, // Tells the user agent to reset the document which sent this request.
    PARTIAL_CONTENT = 206, // This response code is used when the Range header is sent from the client to request only part of a resource.

    MULTIPLE_CHOICE = 300, // The request has more than one possible response. The user agent or user should choose one of them. (There is no standardized way of choosing one of the responses, but HTML links to the possibilities are recommended so the user can pick.)
    MOVED_PERMANENTLY = 301, // The URL of the requested resource has been changed permanently. The new URL is given in the response.
    FOUND = 302, // This response code means that the URI of requested resource has been changed temporarily. Further changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
    SEE_OTHER = 303, // The server sent this response to direct the client to get the requested resource at another URI with a GET request.
    NOT_MODIFIED = 304, // This is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version of the response.
    TERMPORARY_REDIRECT = 307, // The server sends this response to direct the client to get the requested resource at another URI with same method that was used in the prior request. This has the same semantics as the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
    PERMANENT_REDIRECT = 308, // This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.


    BAD_REQUEST = 400, // The request was invalid.
    UNAUTHORIZED = 401, // The request did not include an authentication token or the authentication token was expired.
    FORBIDDEN = 403, // The client did not have permission to access the requested resource.
    NOT_FOUND = 404, // The requested resource was not found.
    METHOD_NOT_ALLOWED = 405, // The HTTP method in the request was not supported by the resource. For example, the DELETE method cannot be used with the Agent API.
    NOT_ACCEPTABLE = 406, // This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.
    PROXY_AUTHENTICATION_REQUIRED = 407, // This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.
    REQUEST_TIMEOUT = 408, // This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
    CONFLICT = 409, // The request could not be completed due to a conflict. For example,  POST ContentStore Folder API cannot complete if the given file or folder name already exists in the parent location.
    GONE = 410, // This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
    LENGTH_REQUIRED = 411, // Server rejected the request because the Content-Length header field is not defined and the server requires it.
    PRECONDITION_FAILED = 412, // One or more conditions in the request header fields evaluated to false.
    PAYLOAD_TOO_LARGE = 413, // Request entity is larger than limits defined by server. The server might close the connection or return an Retry-After header field.
    URI_TOO_LONG = 414, // The URI requested by the client is longer than the server is willing to interpret.
    UNSUPORTED_MEDIA_TYPE = 415, // The media format of the requested data is not supported by the server, so the server is rejecting the request.
    RANGE_NOT_SATISFIABLE = 416, // The range specified by the Range header field in the request cannot be fulfilled. It's possible that the range is outside the size of the target URI's data.
    EXPECTATION_FAILED = 417, // This response code means the expectation indicated by the Expect request header field cannot be met by the server.
    I_AM_TEAPOT = 418, // The server refuses the attempt to brew coffee with a teapot.
    UPGRADE_REQUIRED = 426, // The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).
    PRECONDITION_REQUIRED = 428, // The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
    TOO_MANY_REQUESTS = 429, // The user has sent too many requests in a given amount of time ("rate limiting").
    REQUEST_HEADER_FIELDS_TOO_LARGE = 431, // The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
    UNAVAILABLE_FOR_LEGAL_REASONS = 451, // The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.

    INTERNAL_SERVER_ERROR = 500, // The request was not completed due to an internal error on the server side.
    NOT_IMPLEMENTED = 501, // The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
    BAD_GATEWAY = 502, // This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
    SERVICE_UNAVAILABLE = 503, // The server was unavailable.
    GATEWAY_TIMEOUT = 504, // This error response is given when the server is acting as a gateway and cannot get a response in time.
    HTTP_VERSION_NOT_SUPPORTED = 505, // The HTTP version used in the request is not supported by the server.
    VARIANT_ALSO_NEGOTIATES = 506, // The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
    NOT_EXTENDED = 510, // Further extensions to the request are required for the server to fulfill it.
    NETWORK_AUTHENTICATION_REQUIRED = 511 // Indicates that the client needs to authenticate to gain network access.
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

    public static invalidRefreshToken(instance: string): Error {
        const error: Error = {
            error: ErrorID.INVALID_REFRESH_TOKEN,
            title: ErrorTitle.INVALID_REFRESH_TOKEN,
            status: StatusCode.FORBIDDEN,
            detail: 'Refresh token is invalid',
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
