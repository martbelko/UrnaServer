import { PrismaClient } from '@prisma/client';
import express, { Request } from 'express';

import { Middlewares } from '../Middlewares';
import { ErrorGenerator, StatusCode } from '../../Error';
import { Utils } from '../../utils/Utils';
import { UsersRoutes } from '../Routes';

const prisma = new PrismaClient();

class UserGet {
    public constructor(req: Request) {
        this.id = Number(req.query.id as string | undefined);
        this.steamID = req.query.steamID as string | undefined;
    }

    public readonly id: number;
    public readonly steamID: string | undefined;
}

interface UserPatch {
    id: number;
    name: string | undefined;
    email: string | undefined;
}

export class UsersRouter {
    public constructor() {
        this.mRouter.get(UsersRoutes.GET, async (req, res) => {
            const queryUser = new UserGet(req);
            const users = await prisma.user.findMany({
                where: {
                    id: Utils.isFiniteNumber(queryUser.id) ? queryUser.id : undefined,
                    steamID: queryUser.steamID
                }
            });

            return res.status(StatusCode.OK).send(users);
        });

        this.mRouter.patch(UsersRoutes.PATCH, Middlewares.validateAuthHeader, async (req, res) => {
            const queryUser: UserPatch = {
                id: Number(req.params.id as string | undefined),
                name: req.body.name as string | undefined,
                email: req.body.email as string | undefined
            };

            if (Utils.isFiniteNumber(queryUser.id)) {
                const error = ErrorGenerator.invalidUrlParameter('id', req.originalUrl);
                return res.status(error.status).send(error);
            }

            // TODO: Implement
            throw new Error('Not implemented');
            /*const tokenPayload = req.body.tokenPayload as AccessTokenPayload;

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
            }

            const updatedUser = prisma.user.update({
                data: {
                    name: newName,
                    email: {
                        update: {
                            email: newEmail,
                            verified: newEmail === undefined
                        }
                    }
                },
                where: {
                    id: tokenPayload.userID
                }
            });

            return res.status(StatusCode.OK).send(updatedUser);*/
        });
    }

    public getRouter(): express.Router {
        return this.mRouter;
    }

    private readonly mRouter = express.Router();
}
