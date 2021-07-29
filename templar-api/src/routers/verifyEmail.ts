import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/emailSender';
import { validateUserEmail } from '../validators/userValidator';
import dotenv from 'dotenv';

const prisma = new PrismaClient();
export const router = express.Router();

dotenv.config();

router.get('/api/verify-email/:token', async (req, res) => {
    const token = req.params.token;
    const publicToken = process.env.ACCESS_TOKEN_SECRET as string;

    let status = 200;
    jwt.verify(token, publicToken, async (error, email) => {
        const emailStr = email as unknown as string;
        if (error != undefined) {
            return status = 403;
        }

        try {
            await prisma.verifiedEmail.updateMany({
                where: {
                    email: emailStr,
                    verified: false
                },
                data: {
                    verified: true
                }
            });
        } catch (e) {
            console.log(e);
            return status = 403;
        }
    });

    if (status != 200) {
        return res.sendStatus(status);
    }
    return res.send('OK');
});

router.post('/api/verify-email', async (req, res, next) => {
    const email = req.body.email as string;
    {
        const error = validateUserEmail(email, 'email');
        if (error != null) {
            return res.status(error.status).send({ error: error });
        }
    }

    const usedEmail = await prisma.verifiedEmail.findFirst({
        where: {
            email: email,
            verified: false
        }
    });

    if (usedEmail == null) {
        return res.send({ error: 'No email found' });
    }

    next();
},
async (req, res) => {
    const email = req.body.email as string;
    const tokenStr = process.env.ACCESS_TOKEN_SECRET as string;
    const token = jwt.sign(email, tokenStr);
    await sendEmail({
        from: '"Templay" <templar.headquarters@gmail.com>',
        to: email,
        subject: 'Templay email verification',
        text: 'In order to verify your email, click this link: Verify my email',
        html: `In order to verify your email, click this link: <a href="https://${process.env.IP}:${process.env.PORT}/api/verify-email/${token}">Verify my email</a>`
    });

    res.send('OK');
});

export default router;
