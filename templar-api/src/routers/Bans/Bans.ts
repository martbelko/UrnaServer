import { PrismaClient } from '@prisma/client';
import express from 'express';

import { ErrorGenerator, StatusCode } from '../../Error';
import { Utils } from '../../utils/Utils';
import { BansRoutes } from '../Routes';
import { Middlewares } from './../../routers/Middlewares';

const prisma = new PrismaClient();

export class BansRouter {
    public constructor() {
        this.mRouter.get(BansRoutes.GET, async (req, res) => {
            // TODO: Add pagination
            interface Target {
                id: string | undefined;
                steamID: string | undefined
            }

            interface Admin {
                id: string | undefined;
                nickname: string | undefined;
                steamID: string | undefined;
            }

            const query = {
                id: Number(req.query.id as string | undefined),
                target: req.query.target === undefined ? {
                    id: NaN,
                    steamID: undefined
                } : {
                    id: Number((req.query.target as unknown as Target).id),
                    steamID: (req.query.target as unknown as Target).steamID
                },
                admin: req.query.admin === undefined ? {
                    id: NaN,
                    nickname: undefined,
                    steamID: undefined
                } : {
                    id: Number((req.query.admin as unknown as Admin).id),
                    nickname: (req.query.admin as unknown as Admin).nickname,
                    steamID: (req.query.admin as unknown as Admin).steamID
                }
            };

            if (req.query.id !== undefined && !Utils.isFiniteNumber(query.id)) {
                const error = ErrorGenerator.invalidQueryParameter('id', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (req.query.target !== undefined) {
                const target = req.query.target as unknown as Target;
                if (target.id !== undefined && !Utils.isFiniteNumber(query.target.id)) {
                    const error = ErrorGenerator.invalidQueryParameter('target[id]', req.originalUrl);
                    return res.status(error.status).send(error);
                }
            }

            if (req.query.admin !== undefined) {
                const admin = req.query.admin as unknown as Admin;
                if (admin.id !== undefined && !Utils.isFiniteNumber(query.admin.id)) {
                    const error = ErrorGenerator.invalidQueryParameter('admin[id]', req.originalUrl);
                    return res.status(error.status).send(error);
                }
            }

            try {
                const bans = await prisma.ban.findMany({
                    select: {
                        id: true,
                        admin: {
                            select: {
                                id: true,
                                nickname: true
                            }
                        },
                        length: true,
                        reason: true,
                        server: {
                            select: {
                                ip: true,
                                name: true,
                                serverType: true
                            }
                        },
                        createdAt: true,
                        targetUser: {
                            select: {
                                id: true,
                                steamID: true
                            }
                        },
                        type: true,
                        unban: {
                            select: {
                                admin: {
                                    select: {
                                        id: true,
                                        nickname: true
                                    }
                                }
                            }
                        }
                    },
                    where: {
                        id: Utils.finiteNumberOrUndefined(query.id),
                        admin: {
                            id: Utils.finiteNumberOrUndefined(query.admin.id),
                            nickname: query.admin.nickname,
                            user: {
                                steamID: query.admin.steamID
                            }
                        },
                        targetUser: {
                            id: Utils.finiteNumberOrUndefined(query.target.id),
                            steamID: query.target.steamID
                        }
                    }

                });

                return res.status(StatusCode.OK).send(bans);
            } catch (ex) {
                let error = ErrorGenerator.prismaException(ex, req.originalUrl);
                if (error === null) {
                    error = ErrorGenerator.unknownException(req.originalUrl);
                }

                return res.status(error.status).send(error);
            }
        });

        this.mRouter.post(BansRoutes.POST, Middlewares.validateAuthHeader, async (req, res) => {
            // TODO: Implement
            return res.sendStatus(StatusCode.NOT_IMPLEMENTED);
        });

        this.mRouter.delete(BansRoutes.DELETE, Middlewares.validateAuthHeader, async (req, res) => {
            // TODO: Implement
            return res.sendStatus(StatusCode.NOT_IMPLEMENTED);
        });
    }

    public getRouter(): express.Router {
        return this.mRouter;
    }

    private readonly mRouter = express.Router();
}
