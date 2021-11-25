import { PrismaClient, ServerType } from '@prisma/client';
import express from 'express';

import { ErrorGenerator, StatusCode } from '../../Error';
import { Utils } from '../../utils/Utils';
import { ServersRoutes } from '../Routes';
import { Middlewares } from './../../routers/Middlewares';
import { AccessTokenPayload } from './../../authorization/TokenManager';
import { FlagsManager, WebFlag } from './../../AdminFlags';
import { Constants } from './../../Constants';

const prisma = new PrismaClient();

function getServerTypeFromString(serverType: string | undefined): ServerType | undefined {
    switch (serverType) {
    case 'JAILBREAK': return ServerType.JAILBREAK;
    }

    return undefined;
}

export class ServersRouter {
    public constructor() {
        this.mRouter.get(ServersRoutes.SERVERS_GET, async (req, res) => {
            const query = {
                id: Number(req.query.id as string | undefined),
                ip: req.query.ip as string | undefined,
                serverName: req.query.serverName as string | undefined,
                serverType: getServerTypeFromString(req.body.serverType as string | undefined)
            };

            try {
                const servers = await prisma.server.findMany({
                    where: {
                        id: Utils.isFiniteNumber(query.id) ? query.id : undefined,
                        ip: query.ip,
                        name: query.serverName,
                        serverType: query.serverType
                    }
                });

                return res.status(StatusCode.OK).send(servers);
            } catch (ex) {
                let error = ErrorGenerator.prismaException(ex, req.originalUrl);
                if (error === null) {
                    error = ErrorGenerator.unknownException(req.originalUrl);
                }

                return res.status(error.status).send(error);
            }
        });

        this.mRouter.put(ServersRoutes.SERVERS_PUT, Middlewares.validateAuthHeader, async (req, res) => {
            const tokenPayload = req.body.tokenPayload as AccessTokenPayload;
            const body = {
                ip: req.body.ip as string | undefined,
                serverName: req.body.serverName as string | undefined,
                serverType: getServerTypeFromString(req.body.serverType as string | undefined)
            };

            if (body.ip === undefined || !Constants.IP_REGEX.test(body.ip)) {
                const error = ErrorGenerator.invalidBodyParameter('ip', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (body.serverName === undefined) {
                const error = ErrorGenerator.invalidBodyParameter('serverName', req.originalUrl);
                return res.status(error.status).send(error);
            }

            if (body.serverType === undefined) {
                const error = ErrorGenerator.invalidBodyParameter('serverType', req.originalUrl);
                return res.status(error.status).send(error);
            }

            const targetServerID = Number(req.params.id as string);
            if (!Utils.isFiniteNumber(targetServerID)) {
                const error = ErrorGenerator.invalidUrlParameter('id', req.originalUrl);
                return res.status(error.status).send(error);
            }

            try {
                const admin = await prisma.admin.findFirst({
                    select: {
                        csFlags: true,
                        webFlags: true,
                        dcFlags: true
                    },
                    where: {
                        user: {
                            id: tokenPayload.userID,
                            createdAt: tokenPayload.userCreatedAt
                        }
                    }
                });

                if (admin === null) {
                    const error = ErrorGenerator.forbidden(req.originalUrl);
                    return res.status(error.status).send(error);
                }

                const fm = new FlagsManager(admin.csFlags, admin.webFlags, admin.dcFlags);
                if (!fm.hasWebFlags(WebFlag.ADD_OR_MODIFY_SERVER)) {
                    const error = ErrorGenerator.forbidden(req.originalUrl);
                    return res.status(error.status).send(error);
                }

                const updatedServer = await prisma.server.update({
                    where: {
                        id: targetServerID
                    },
                    data: {
                        ip: body.ip,
                        name: body.serverName,
                        serverType: body.serverType
                    }
                });

                return res.status(StatusCode.OK).send(updatedServer);
            } catch (ex) {
                let error = ErrorGenerator.prismaException(ex, req.originalUrl);
                if (error === null) {
                    error = ErrorGenerator.unknownException(req.originalUrl);
                }

                return res.status(error.status).send(error);
            }
        });

        this.mRouter.post(ServersRoutes.ON_CLIENT_CONNECT_POST, async (req, res) => {
            // TODO: Implement
            return res.sendStatus(StatusCode.NOT_IMPLEMENTED);
        });
    }

    public getRouter(): express.Router {
        return this.mRouter;
    }

    private readonly mRouter = express.Router();
}
