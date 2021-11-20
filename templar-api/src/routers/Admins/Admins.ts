import { PrismaClient } from '@prisma/client';
import express from 'express';

import { FlagsManager } from './../../AdminFlags';
import { StatusCode } from '../../Error';
import { Utils } from '../../utils/Utils';
import { AdminsRoutes } from '../Routes';

const prisma = new PrismaClient();

interface AdminGet {
    id: number;
    name: string | undefined;
    steamID: string | undefined;
    csFlags: number;
    webFlags: number;
    dcFlags: number;

    minImmunity: number;
    maxImmunity: number;
}

export class AdminsRouter {
    public constructor() {
        this.mRouter.get(AdminsRoutes.GET, async (req, res) => {
            const query: AdminGet = {
                id: Number(req.query.id as string | undefined),
                name: req.query.name as string | undefined,
                steamID: req.query.steamID as string | undefined,
                csFlags: Number(req.query.csFlags as string | undefined),
                webFlags: Number(req.query.webFlags as string | undefined),
                dcFlags: Number(req.query.dcFlags as string | undefined),

                minImmunity: Number(req.query.minImmunity as string | undefined),
                maxImmunity: Number(req.query.maxImmunity as string | undefined),
            };

            let admins = await prisma.admin.findMany({
                where: {
                    id: Utils.isFiniteNumber(query.id) ? query.id : undefined,
                    steamID: query.steamID,
                    user: {
                        name: query.name
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
        });
    }

    public getRouter(): express.Router {
        return this.mRouter;
    }

    private readonly mRouter = express.Router();
}
