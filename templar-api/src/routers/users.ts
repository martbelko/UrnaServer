import { PrismaClient } from '@prisma/client';
import express from 'express';
import { TextEncoder } from 'util';

import { generateSalt, hashPassword, hashSalt } from './../database';
import { validateUserEmail, validateUserName } from './../validators/userValidator';
import { validatePassword } from './../validators/passwordValidator';
import BaseError, { ErrorType, generateErrorFromPrismaException } from './../error';
import { validateAuthHeader } from '../utils/authHeaderValidator';
import { validateCaptcha } from '../validators/captchaValidator';

const prisma = new PrismaClient();
export const router = express.Router();

router.get('/api/users', async (req, res) => {
    const authUser = await validateAuthHeader(req.headers.authorization);
    async function isPrivilegedAdmin() {
        if (typeof authUser == 'number') {
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

    const id = Number(req.query.id as string | undefined);
    const name = req.query.name as string | undefined;
    const email = req.query.email as string | undefined;

    const users = await prisma.user.findMany({
        select: {
            id: isAdmin,
            name: isAdmin || (name != undefined),
            email: isAdmin || (email != undefined),
            Vip: isAdmin,
            createdAt: isAdmin,
            updatedAt: false
        },
        where: {
            id: isNaN(id) ? undefined : (isAdmin ? id : undefined),
            name: name,
            email: {
                email: email
            }
        }
    });

    if (!isAdmin && users.length > 1) {
        const error: BaseError = {
            type: ErrorType.MultipleResults,
            title: 'Multiple results',
            status: 403,
            detail: 'Multiple results found'
        };

        return res.status(error.status).send({ error: error });
    }

    return res.send(JSON.stringify(users));
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

    {
        const error = await validateCaptcha(captcha, 'captcha');
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

    const name = req.body.name as string;
    {
        const error = validateUserName(name, 'name');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const email = req.body.email as string;
    {
        const error = validateUserEmail(email, 'email');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const password = req.body.password as string;
    {
        const error = validatePassword(password, 'password');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const password2 = req.body.password2 as string;
    if (password2 == undefined) {
        const error: BaseError = {
            type: ErrorType.WasNull,
            title: 'Missing password2 parameter',
            status: 400,
            detail: 'password parameter was specified, but password2 parameter was not'
        };
        return res.status(error.status).send({ error: error });
    }

    if (password != password2) {
        const error: BaseError = {
            type: ErrorType.PasswordsMismatch,
            title: 'passwords did not match',
            status: 400,
            detail: 'password parameter and password2 parameter did not match'
        };
        return res.status(error.status).send({ error: error });
    }

    const salt = generateSalt();
    const hashedPassword = new TextEncoder().encode(hashPassword(password, salt));
    const hashedSalt = hashSalt(salt);

    const user: UserPatch = {
        id: id,
        name: name,
        email: email,
        password: hashedPassword && Array.from(hashedPassword),
        salt: hashedSalt
    };

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
});

export default router;
