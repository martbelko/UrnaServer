export enum UsersRoutes {
    GET = '/api/users',
    PATCH = '/api/users/:id'
}

export enum AdminsRoutes {
    GET = '/api/admins',
    POST = '/api/admins',
    PATCH = '/api/admins/:id',
    DELETE = '/api/admins/:id'
}

export enum AuthRoutes {
    TOKEN_POST = '/auth/token',
    STEAM_AUTH = '/auth/steam',
    STEAM_AUTH_RETURN = '/auth/steam/return',
    STEAM_AUTH_FAIL = '/auth/steam/fail'
}
