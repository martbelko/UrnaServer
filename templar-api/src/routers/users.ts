import { PrismaClient } from '@prisma/client';
import express from 'express';
import { TextEncoder } from 'util';

import { generateSalt, hashPassword, hashSalt } from './../database';
import { validateUserEmail, validateUserName } from './../validators/userValidator';
import { validatePassword } from './../validators/passwordValidator';
import BaseError, { ErrorType, generateErrorFromPrismaException } from './../error';
import { validateAuthHeader } from '../utils/authValidator';

const prisma = new PrismaClient();
export const router = express.Router();

interface UserGet {
    id: number;
    name: string;
    email: string;
}

router.get('/api/users', async (req, res, next) => {
    const authUser = validateAuthHeader(req.headers.authorization);
    if (typeof authUser == 'number') {
        return res.sendStatus(authUser);
    }

    const id = Number(req.query.id as string);
    const name = req.query.name as string;
    const email = req.query.email as string;
    req.params = { id: isNaN(id) ? undefined : id, name: name, email: email } as UserGet;

    next();
},
async (req, res) => {
    const user = req.params as UserGet;
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
        },
        where: {
            id: user.id,
            name: user.name,
            email: {
                email: user.email
            }
        }
    });

    res.send(JSON.stringify(users));
});

interface UserPost {
    name: string;
    email: string;
    password: Array<number>;
    salt: string;
}

router.post('/api/users', (req, res, next) => {
    if (req.body instanceof Array) {
        return res.send({ error: 'Can insert only 1 user' });
    }

    const name = req.body.name as string;
    const email = req.body.email as string;
    const password = req.body.password as string;

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

    req.params = user;
    next();
},
async (req, res) => {
    const user = req.params as UserPost;
    try {
        const insertedUser = await prisma.user.create({
            select: {
                id: true,
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

        res.send({ user: insertedUser });
    } catch (e) {
        const error = generateErrorFromPrismaException(e);
        res.send({ error: error });
    }
});

interface UserPatch {
    id: number;
    name: string | undefined;
    email: string | undefined;
    password: Array<number> | undefined;
    salt: string | undefined;
}

router.patch('/api/users/:id', (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        const error: BaseError = {
            type: ErrorType.InvalidID,
            title: 'Invalid id parameter',
            status: 401,
            detail: `id paramter must be a number, but was ${req.params.id}`
        };
        return res.status(error.status).send({ error: error });
    }

    const name = req.body.name as string;
    if (name != undefined) {
        const error = validateUserName(name, 'name');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const email = req.body.email as string;
    if (email != null) {
        const error = validateUserEmail(email, 'email');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const password = req.body.password as string;
    if (password != undefined) {
        const error = validatePassword(password, 'password');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const password2 = req.body.password2 as string;
    if (password != undefined) {
        if (password2 == undefined) {
            const error: BaseError = {
                type: ErrorType.WasNull,
                title: 'Missing password2 parameter',
                status: 401,
                detail: 'password parameter was specified, but password2 parameter was not'
            };
            return res.status(error.status).send({ error: error });
        }

        if (password != password2) {
            const error: BaseError = {
                type: ErrorType.PasswordsMismatch,
                title: 'passwords did not match',
                status: 401,
                detail: 'password parameter and password2 parameter did not match'
            };
            return res.status(error.status).send({ error: error });
        }
    }

    let hashedPassword: Uint8Array | undefined = undefined;
    let hashedSalt: string | undefined = undefined;
    if (password != undefined) {
        const salt = generateSalt();
        hashedPassword = new TextEncoder().encode(hashPassword(password, salt));
        hashedSalt = hashSalt(salt);
    }

    const user: UserPatch = {
        id: id,
        name: name,
        email: email,
        password: hashedPassword && Array.from(hashedPassword),
        salt: hashedSalt
    };
    req.body = user;

    next();
},
async (req, res) => {
    const user = req.body as UserPatch;
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
