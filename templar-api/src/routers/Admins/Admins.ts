import { PrismaClient } from '@prisma/client';
import express from 'express';

import { CSFlag, DiscordFlag, FlagsManager, WebFlag } from './../../AdminFlags';
import { ErrorGenerator, StatusCode } from '../../Error';
import { Utils } from '../../utils/Utils';
import { AdminsRoutes } from '../Routes';
import { Middlewares } from './../../routers/Middlewares';
import { AccessTokenPayload } from './../../authorization/TokenManager';
import { Constants } from './../../Constants';

const prisma = new PrismaClient();

function isValidFlagsInternal(flags: number, enumLen: number): boolean {
    if (!Utils.isFiniteNumber(flags)) {
        return false;
    }

    if (flags <= 0) {
        return false;
    }

    let maxSum = 0;
    for (let i = 0; i < enumLen; ++i) {
        maxSum += 1 << i;
    }

    if (flags > maxSum) {
        return false;
    }

    return true;
}

function isValidCSFlags(csFlags: number): boolean {
    const enumLen = Object.keys(CSFlag).length / 2;
    return isValidFlagsInternal(csFlags, enumLen);
}

function isValidWebFlags(webFlags: number): boolean {
    const enumLen = Object.keys(WebFlag).length / 2;
    return isValidFlagsInternal(webFlags, enumLen);
}

function isValidDCFlags(dcFlags: number): boolean {
    const enumLen = Object.keys(DiscordFlag).length / 2;
    return isValidFlagsInternal(dcFlags, enumLen);
}

function isValidImmunity(immunity: number): boolean {
    return immunity > Constants.MIN_IMMUNITY &&
        immunity < Constants.MAX_IMMUNITY;
}

export class AdminsRouter {
    public constructor() {
        this.mRouter.get(AdminsRoutes.GET, Middlewares.validateAuthHeader, async (req, res) => {
            const query = {
                id: Number(req.query.id as string | undefined),
                nickname: req.query.nickname as string | undefined,
                steamID: req.query.steamID as string | undefined,
                csFlags: Number(req.query.csFlags as string | undefined),
                webFlags: Number(req.query.webFlags as string | undefined),
                dcFlags: Number(req.query.dcFlags as string | undefined),

                minImmunity: Number(req.query.minImmunity as string | undefined),
                maxImmunity: Number(req.query.maxImmunity as string | undefined)
            };

            try {
                let admins = await prisma.admin.findMany({
                    where: {
                        id: Utils.isFiniteNumber(query.id) ? query.id : undefined,
                        nickname: query.nickname,
                        user: {
                            steamID: query.steamID
                        }
                    }
                });

                admins = admins.filter(admin => {
                    // Check flags
                    const flagsManager = new FlagsManager(admin.csFlags, admin.webFlags, admin.dcFlags);
                    if (Utils.isFiniteNumber(query.csFlags)) {
                        if (!flagsManager.hasCSFlags(query.csFlags)) {
                            return false;
                        }
                    }

                    if (Utils.isFiniteNumber(query.webFlags)) {
                        if (!flagsManager.hasWebFlags(query.webFlags)) {
                            return false;
                        }
                    }

                    if (Utils.isFiniteNumber(query.dcFlags)) {
                        if (!flagsManager.hasDCFlags(query.dcFlags)) {
                            return false;
                        }
                    }

                    // Check immunity
                    if (Utils.isFiniteNumber(query.minImmunity)) {
                        if (admin.immunity < query.minImmunity) {
                            return false;
                        }
                    }

                    if (Utils.isFiniteNumber(query.maxImmunity)) {
                        if (admin.immunity > query.maxImmunity) {
                            return false;
                        }
                    }

                    return true;
                });

                return res.status(StatusCode.OK).send(admins);
            } catch (ex) {
                let error = ErrorGenerator.prismaException(ex, req.originalUrl);
                if (error === null) {
                    error = ErrorGenerator.unknownException(req.originalUrl);
                }

                return res.status(error.status).send(error);
            }
        });

        this.mRouter.post(AdminsRoutes.POST, Middlewares.validateAuthHeader, async (req, res) => {
            const tokenPayload = req.body.tokenPayload as AccessTokenPayload;
            const reqAdmin = await prisma.admin.findFirst({
                select: {
                    csFlags: true,
                    webFlags: true,
                    dcFlags: true
                },
                where: {
                    userID: tokenPayload.userID
                }
            });

            if (reqAdmin === null) {
                const error = ErrorGenerator.forbidden(req.originalUrl);
                return res.status(error.status).send(error);
            }

            const fm = new FlagsManager(reqAdmin.csFlags, reqAdmin.webFlags, reqAdmin.dcFlags);
            if (!fm.hasWebFlags(WebFlag.ADD_NEW_ADMIN)) {
                const error = ErrorGenerator.forbidden(req.originalUrl);
                return res.status(error.status).send(error);
            }

            const query = {
                userID: Number(req.body.id as string | undefined),
                nickname: req.body.nickname as string | undefined,
                csFlags: Number(req.body.csFlags as string | undefined),
                webFlags: Number(req.body.webFlags as string | undefined),
                dcFlags: Number(req.body.dcFlags as string | undefined),
                immunity: Number(req.body.immunity as string | undefined)
            };

            if (!Utils.isFiniteNumber(query.userID)) {
                const error = ErrorGenerator.invalidBodyParameter('userID', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (query.nickname === undefined) { // TODO: More validation on nickname
                const error = ErrorGenerator.missingBodyParameter('nickname', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (!isValidCSFlags(query.csFlags)) {
                const error = ErrorGenerator.invalidBodyParameter('csFlags', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (!isValidWebFlags(query.webFlags)) {
                const error = ErrorGenerator.invalidBodyParameter('webFlags', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (!isValidDCFlags(query.dcFlags)) {
                const error = ErrorGenerator.invalidBodyParameter('dcFlags', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (!isValidImmunity(query.immunity)) {
                const error = ErrorGenerator.invalidBodyParameter('immunity', req.originalUrl);
                return res.status(error.status).send(error);
            }

            try {
                const newAdmin = await prisma.admin.create({
                    data: {
                        userID: query.userID,
                        nickname: query.nickname,
                        csFlags: query.csFlags,
                        webFlags: query.webFlags,
                        dcFlags: query.dcFlags,
                        immunity: query.immunity
                    }
                });

                return res.status(StatusCode.CREATED).send(newAdmin);
            } catch (ex) {
                let error = ErrorGenerator.prismaException(ex, req.originalUrl);
                if (error === null) {
                    error = ErrorGenerator.unknownException(req.originalUrl);
                }

                return res.status(error.status).send(error);
            }
        });

        this.mRouter.put(AdminsRoutes.PUT, Middlewares.validateAuthHeader, async (req, res) => {
            const tokenPayload = req.body.tokenPayload as AccessTokenPayload;
            try {
                const reqAdmin = await prisma.admin.findFirst({
                    select: {
                        csFlags: true,
                        webFlags: true,
                        dcFlags: true
                    },
                    where: {
                        userID: tokenPayload.userID
                    }
                });

                if (reqAdmin === null) {
                    const error = ErrorGenerator.forbidden(req.originalUrl);
                    return res.status(error.status).send(error);
                }

                const fm = new FlagsManager(reqAdmin.csFlags, reqAdmin.webFlags, reqAdmin.dcFlags);
                if (!fm.hasWebFlags(WebFlag.UPDATE_ADMIN_FLAGS)) {
                    const error = ErrorGenerator.forbidden(req.originalUrl);
                    return res.status(error.status).send(error);
                }

                const selectedAdminID = Number(req.params.id as string);
                if (!Utils.isFiniteNumber(selectedAdminID)) {
                    const error = ErrorGenerator.invalidUrlParameter('id', req.originalUrl);
                    return res.status(error.status).send(error);
                }

                const body = {
                    nickname: req.body.nickname as string | undefined,
                    csFlags: Number(req.body.csFlags as string | undefined),
                    webFlags: Number(req.body.webFlags as string | undefined),
                    dcFlags: Number(req.body.dcFlags as string | undefined),
                    immunity: Number(req.body.immunity as string | undefined)
                };

                if (body.nickname === undefined) {
                    const error = ErrorGenerator.invalidBodyParameter('nickname', req.originalUrl);
                    return res.status(error.status).send(error);
                }

                // TODO: Validate nickname

                if (!isValidCSFlags(body.csFlags)) {
                    const error = ErrorGenerator.invalidBodyParameter('csFlags', req.originalUrl);
                    return res.status(error.status).send(error);
                }

                if (!isValidWebFlags(body.webFlags)) {
                    const error = ErrorGenerator.invalidBodyParameter('webFlags', req.originalUrl);
                    return res.status(error.status).send(error);
                }

                if (!isValidDCFlags(body.dcFlags)) {
                    const error = ErrorGenerator.invalidBodyParameter('dcFlags', req.originalUrl);
                    return res.status(error.status).send(error);
                }

                if (!isValidImmunity(body.immunity)) {
                    const error = ErrorGenerator.invalidBodyParameter('immunity', req.originalUrl);
                    return res.status(error.status).send(error);
                }

                const target = await prisma.admin.findFirst({
                    select: {
                        id: true
                    },
                    where: {
                        id: selectedAdminID
                    }
                });

                if (target === null) {
                    const error = ErrorGenerator.missingUrlParameter('id', req.originalUrl);
                    return res.status(error.status).send(error);
                }

                const updatedAdmin = await prisma.admin.update({
                    data: {
                        nickname: body.nickname,
                        csFlags: body.csFlags,
                        webFlags: body.webFlags,
                        dcFlags: body.dcFlags,
                        immunity: body.immunity
                    },
                    where: {
                        id: target.id
                    },
                    select: {
                        nickname: true,
                        csFlags: true,
                        webFlags: true,
                        dcFlags: true,
                        immunity: true
                    }
                });

                return res.status(StatusCode.OK).send(updatedAdmin);
            } catch (ex) {
                let error = ErrorGenerator.prismaException(ex, req.originalUrl);
                if (error === null) {
                    error = ErrorGenerator.unknownException(req.originalUrl);
                }

                return res.status(error.status).send(error);
            }
        });

        this.mRouter.delete(AdminsRoutes.DELETE, Middlewares.validateAuthHeader, async (req, res) => {
            // TODO: Implement
            return res.sendStatus(StatusCode.NOT_IMPLEMENTED);
        });
    }

    public getRouter(): express.Router {
        return this.mRouter;
    }

    private readonly mRouter = express.Router();
}
