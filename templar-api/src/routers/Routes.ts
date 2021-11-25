export enum UsersRoutes {
    GET = '/api/users',
    PATCH = '/api/users/:id'
}

export enum AdminsRoutes {
    GET = '/api/admins',
    POST = '/api/admins',
    PUT = '/api/admins/:id',
    DELETE = '/api/admins/:id'
}

export enum AuthRoutes {
    TOKEN_POST = '/auth/token',
    STEAM_AUTH = '/auth/steam',
    STEAM_AUTH_RETURN = '/auth/steam/return',
    STEAM_AUTH_FAIL = '/auth/steam/fail'
}

export enum ServersRoutes {
    SERVERS_GET = '/api/servers',
    SERVERS_PUT = '/api/servers/:id',
    ON_CLIENT_CONNECT_POST = '/api/servers/on-client-connect'
}

export enum BansRoutes {
    GET = '/api/bans',
    POST = '/api/bans',
    DELETE = '/api/bans:id'
}
