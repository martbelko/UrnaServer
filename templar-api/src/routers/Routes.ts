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
    TOKEN_POST = '/auth/token'
}