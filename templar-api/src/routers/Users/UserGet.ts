import { PrismaClient } from '@prisma/client';
import express, { Request } from 'express';

import { Middlewares } from './../../routers/Middlewares';
import { Constants } from './../../Constants';
import { ErrorGenerator, StatusCode } from './../../Error';
import { PasswordManager } from './../../utils/PasswordManager';
import { Utils } from './../../utils/Utils';
import { UsersRoutes } from './../Users/UsersRoutes';
import { AccessTokenPayload } from './../../authorization/TokenManager';
import { EROFS } from 'constants';


const prisma = new PrismaClient();

class UserGet {
    public constructor(req: Request) {
        this.id = Number(req.query.id as string | undefined);
        this.name = req.query.name as string | undefined;
        this.email = req.query.email as string | undefined;
    }

    public readonly id: number;
    public readonly name: string | undefined;
    public readonly email: string | undefined;
}

class UserPost {
    public static async fromRequest(req: Request): Promise<UserPost> {
        const body = await req.body;
        return new UserPost(body);
    }

    public readonly name: string | undefined;
    public readonly email: string | undefined;
    public readonly password: string | undefined;

    // We can disable eslint for here, because body parameter will be
    // the actual body of the request
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private constructor(body: any) {
        this.name = body.name;
        this.email = body.email;
        this.password = body.password;
    }
}

interface UserPatch {
    id: number;
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;
}

export class UsersGetRouter {
    public constructor() {
        this.mRouter.get(UsersRoutes.GET, async (req, res) => {
            const queryUser = new UserGet(req);
            const users = await prisma.user.findMany({
                where: {
                    id: Utils.isFiniteNumber(queryUser.id) ? queryUser.id : undefined,
                    name: queryUser.name,
                    email: {
                        email: queryUser.email
                    }
                }
            });

            return res.status(StatusCode.OK).send(users);
        });

        this.mRouter.post(UsersRoutes.POST, async (req, res) => {
            const queryUser = await UserPost.fromRequest(req);
            console.log(queryUser);
            if (queryUser.name === undefined) {
                const error = ErrorGenerator.missingBodyParameter('name', req.originalUrl);
                return res.status(error.status).send(error);
            }
            if (queryUser.email === undefined) {
                const error = ErrorGenerator.missingBodyParameter('email', req.originalUrl);
                return res.status(error.status).send(error);
            }
            if (queryUser.password === undefined) {
                const error = ErrorGenerator.missingBodyParameter('password', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (Utils.validateUserName(queryUser.name) !== null) {
                const error = ErrorGenerator.invalidBodyParameter('name', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (Utils.validateEmail(queryUser.email) !== null) {
                const error = ErrorGenerator.invalidBodyParameter('email', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (Utils.validatePassword(queryUser.password) !== null) {
                const error = ErrorGenerator.invalidBodyParameter('password', req.originalUrl);
                return res.status(error.status).send(error);
            }

            const { hashedPassword, salt } = PasswordManager.hashPassword(queryUser.password);
            try {
                const createdUser = await prisma.user.create({
                    data: {
                        name: queryUser.name,
                        email: {
                            create: {
                                email: queryUser.email,
                                verified: false
                            }
                        },
                        password: {
                            create: {
                                password: Array.from(hashedPassword),
                                salt: salt
                            }
                        }
                    }
                });

                return res.status(StatusCode.CREATED).send(createdUser);
            } catch (ex) {
                const prismaError = ErrorGenerator.prismaException(ex, req.originalUrl);
                if (prismaError !== null) {
                    return res.status(prismaError.status).send(prismaError);
                }

                const error = ErrorGenerator.unknownException(req.originalUrl);
                return res.status(error.status).send(error);
            }
        });

        this.mRouter.patch(UsersRoutes.PATCH, Middlewares.validateAuthHeader, async (req, res) => {
            const queryUser: UserPatch = {
                id: Number(req.params.id as string | undefined),
                name: req.body.name as string | undefined,
                email: req.body.email as string | undefined,
                password: req.body.password as string | undefined
            };

            if (Utils.isFiniteNumber(queryUser.id)) {
                const error = ErrorGenerator.invalidUrlParameter('id', req.originalUrl);
                return res.status(error.status).send(error);
            }

            const tokenPayload = req.body.tokenPayload as AccessTokenPayload;

            if (queryUser.id !== tokenPayload.userID) { // Someone is trying to update someone's else account
                const queryUserAdmin = prisma.admin.findFirst({
                    where: {
                        userID: tokenPayload.userID
                    }
                });

                if (queryUserAdmin === null) {
                    const error = ErrorGenerator.forbidden(req.originalUrl);
                    return res.status(error.status).send(error);
                }

                // TODO: Finish, check admin flags, allow only high-value admins to change this
                throw new Error('Not implemented');
            }

            let newName: string | undefined = undefined;
            let newEmail: string | undefined = undefined;
            let newPassword: Uint8Array | undefined = undefined;
            let newSalt: string | undefined = undefined;

            if (queryUser.name !== undefined) {
                if (Utils.validateUserName(queryUser.name) !== null) {
                    const error = ErrorGenerator.invalidBodyParameter('name', req.originalUrl);
                    return res.status(error.status).send(error);
                }

                newName = queryUser.name;
            }

            if (queryUser.email !== undefined) {
                if (Utils.validateEmail(queryUser.email) !== null) {
                    const error = ErrorGenerator.invalidBodyParameter('name', req.originalUrl);
                    return res.status(error.status).send(error);
                }

                newEmail = queryUser.email;
            }

            if (queryUser.password !== undefined) {
                if (Utils.validatePassword(queryUser.password) !== null) {
                    const error = ErrorGenerator.invalidBodyParameter('password', req.originalUrl);
                    return res.status(error.status).send(error);
                }

                const { hashedPassword, salt } = PasswordManager.hashPassword(queryUser.password as string);
                newPassword = hashedPassword;
                newSalt = salt;
            }

            const updatedUser = prisma.user.update({
                data: {
                    name: newName,
                    email: {
                        update: {
                            email: newEmail,
                            verified: newEmail === undefined
                        }
                    },
                    password: {
                        update: {
                            password: Array.from(newPassword),
                            salt: newSalt
                        }
                    }
                },
                where: {
                    id: tokenPayload.userID
                }
            });
        });
    }

    public getRouter(): express.Router {
        return this.mRouter;
    }

    private readonly mRouter = express.Router();
}
