import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOSTNAME,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    logger: false,
    tls: {
        rejectUnauthorized: false
    }
});

export async function sendEmail(email: MailOptions): Promise<SMTPTransport.SentMessageInfo | null> {
    try {
        const sentInfo = await transporter.sendMail(email);
        return sentInfo;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export default sendEmail;
