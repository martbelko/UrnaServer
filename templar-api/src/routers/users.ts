import { PrismaClient } from '@prisma/client';
import express from 'express';
import { TextEncoder } from 'util';

import { generateSalt, hashPassword, hashSalt } from './../database';
import { validateUserEmail, validateUserName } from './../validators/userValidator';
import { validatePassword } from './../validators/passwordValidator';
import BaseError, { ErrorType, generateErrorFromPrismaException, isError } from './../error';
import { validateAuthHeader } from '../utils/authHeaderValidator';
import { validateCaptcha } from '../validators/captchaValidator';
import { AccessTokenPayload } from '../auth/auth';

const prisma = new PrismaClient();
export const router = express.Router();

router.get('/api/users', async (req, res) => {
    const authUser = await validateAuthHeader(req.headers.authorization);
    async function isPrivilegedAdmin(): Promise<boolean> {
        if (isError(authUser)) {
            return false;
        }

        const admin = await prisma.admin.findFirst({
            where: {
                userID: authUser.userid
            }
        });

        if (admin == null) {
            return false;
        }

        // TODO: Check admin flags...

        return true;
    }

    const isAdmin = await isPrivilegedAdmin();
    const isAuthUser = !isAdmin && typeof authUser != 'number';

    const id = Number(req.query.id as string | undefined);
    const name = req.query.name as string | undefined;
    const email = req.query.email as string | undefined;

    if (!isAdmin && !isAuthUser && isNaN(id) && name == undefined && email == undefined) {
        return res.status(401).send({ error: 'Multiple results found' });
    }

    if (!isAdmin && !isAuthUser && !isNaN(id)) {
        return res.status(401).send({ error: 'id parameter cannot be specified' }); // TODO: Send BaseError
    }

    const users = await prisma.user.findMany({
        select: {
            id: isAdmin || isAuthUser || !isNaN(id),
            name: isAdmin || isAuthUser || (name != undefined),
            email: !isAdmin && !isAuthUser && email == undefined ? false : {
                select: {
                    email: true,
                    verified: isAdmin
                }
            },
            vips: isAdmin,
            createdAt: isAdmin,
            updatedAt: false
        },
        where: {
            id: isNaN(id) ? undefined : id,
            name: name,
            email: {
                email: email
            }
        }
    });

    if (users.length == 0) {
        return res.send(users);
    }

    if (!isAdmin && users.length > 1) {
        const error: BaseError = {
            type: ErrorType.MultipleResults,
            title: 'Multiple results',
            status: 401,
            detail: 'Multiple results found'
        };

        return res.status(error.status).send({ error: error });
    }

    if (isAuthUser) {
        const userid = (authUser as AccessTokenPayload).userid;
        if (userid != users[0].id) {
            return res.sendStatus(401);
        }
    }

    return res.send(users);
});

interface UserPost {
    name: string;
    email: string;
    password: Array<number>;
    salt: string;
}

router.post('/api/users', async (req, res) => {
    // TODO: Add spam protection

    const name = req.body.name as string;
    const email = req.body.email as string;
    const password = req.body.password as string;
    const captcha = req.body.captcha as string;

    {
        const error = await validateCaptcha(captcha, 'captcha');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    {
        const error = validateUserName(name, 'name');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    {
        const error = validateUserEmail(email, 'email');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    {
        const error = validatePassword(password, 'password');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const salt = generateSalt();
    const hashedPassword = new TextEncoder().encode(hashPassword(password, salt));
    const hashedSalt = hashSalt(salt);

    const user: UserPost = {
        name: req.body.name,
        email: req.body.email,
        password: Array.from(hashedPassword),
        salt: hashedSalt
    };

    // TODO: Send verification email

    try {
        const insertedUser = await prisma.user.create({
            select: {
                name: true,
                email: {
                    select: {
                        email: true,
                        verified: false
                    }
                }
            },
            data: {
                name: user.name,
                email: {
                    create: {
                        email: user.email
                    }
                },
                password: {
                    create: {
                        password: user.password,
                        salt: user.salt
                    }
                }
            }
        });

        return res.send({ user: insertedUser });
    } catch (e) {
        const error = generateErrorFromPrismaException(e);
        return res.status(error.status).send({ error: error });
    }
});

interface UserPatch {
    id: number;
    name: string | undefined;
    email: string | undefined;
    password: Array<number> | undefined;
    salt: string | undefined;
}

router.patch('/api/users/:id', async (req, res) => {
    const authUser = await validateAuthHeader(req.headers.authorization);
    if (isError(authUser)) {
        return res.sendStatus(401);
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
        const error: BaseError = {
            type: ErrorType.InvalidID,
            title: 'Invalid id parameter',
            status: 400,
            detail: `id paramter must be a number, but was ${req.params.id}`
        };

        return res.status(error.status).send({ error: error });
    }

    if (authUser.userid != id) {
        return res.status(400).send({ error: 'IDs don\'t match' });
    }

    {
        const user = await prisma.user.findFirst({
            where: {
                id: authUser.userid
            }
        });

        if (user == null) {
            return res.status(400).send({ error: 'No user found' });
        }
    }

    const captcha = req.body.captcha as string;
    {
        const error = await validateCaptcha(captcha, 'captcha');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const name = req.body.name as string;
    if (name != undefined)
    {
        const error = validateUserName(name, 'name');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const email = req.body.email as string;
    if (email != undefined)
    {
        const error = validateUserEmail(email, 'email');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const password = req.body.password as string;
    if (password != undefined)
    {
        const error = validatePassword(password, 'password');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const salt = generateSalt();
    const hashedPassword = new TextEncoder().encode(hashPassword(password, salt));
    const hashedSalt = hashSalt(salt);

    const user: UserPatch = {
        id: id,
        name: name,
        email: email,
        password: password == undefined ? undefined : Array.from(hashedPassword),
        salt: password == undefined ? undefined : hashedSalt
    };

    // TODO: Send verification email

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                name: user.name,
                email: {
                    update: {
                        email: user.email,
                    }
                },
                password: {
                    update: {
                        password: user.password,
                        salt: user.salt
                    }
                }
            }
        });

        return res.send({ user: updatedUser });
    } catch (e) {
        const error = generateErrorFromPrismaException(e);
        return res.status(error.status).send({ error: error });
    }
});

export default router;
