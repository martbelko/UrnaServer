import express, { Request } from 'express';
import { PrismaClient } from '@prisma/client';

import { ErrorGenerator, StatusCode } from './../../Error';
import { UsersRoutes } from './../Users/UsersRoutes';
import { Constants } from './../../Constants';
import { PasswordManager } from './../../utils/PasswordManager';
import { Utils } from './../../utils/Utils';

const prisma = new PrismaClient();

class UserGet {
    constructor(req: Request) {
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
            if (queryUser.name == undefined) {
                console.log(queryUser);
                const error = ErrorGenerator.missingParameter('name', req.originalUrl);
                return res.status(error.status).send(error);
            }
            if (queryUser.email == undefined) {
                const error = ErrorGenerator.missingParameter('email', req.originalUrl);
                return res.status(error.status).send(error);
            }
            if (queryUser.password == undefined) {
                const error = ErrorGenerator.missingParameter('password', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (queryUser.name.length < Constants.MIN_PASSWORD_LEN) {
                const error = ErrorGenerator.invalidParameter('name', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (queryUser.name.length < Constants.MIN_USERNAME_LEN ||
                queryUser.name.length > Constants.MAX_USERNAME_LEN) {
                const error = ErrorGenerator.invalidParameter('name', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (!Constants.EMAIL_REGEX.test(queryUser.email)) {
                const error = ErrorGenerator.invalidParameter('email', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (queryUser.password.length < Constants.MIN_PASSWORD_LEN ||
                queryUser.password.length > Constants.MAX_USERNAME_LEN) {
                const error = ErrorGenerator.invalidParameter('password', req.originalUrl);
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
                if (prismaError != null) {
                    return res.status(prismaError.status).send(prismaError);
                }

                const error = ErrorGenerator.unknownException(req.originalUrl);
                return res.status(error.status).send(error);
            }
        });
    }

    public getRouter(): express.Router {
        return this.mRouter;
    }

    private readonly mRouter = express.Router();
}
