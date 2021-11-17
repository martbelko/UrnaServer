import { randomInt } from 'crypto';
import { pbkdf2 } from 'fast-sha256';

export class PasswordManager {
    public static hashPassword(password: string): { hashedPassword: Uint8Array, salt: string } {
        const salt = this.generateSalt();
        const hashedPassword = pbkdf2(new TextEncoder().encode(password), new TextEncoder().encode(salt), 10000, 128);
        return { hashedPassword: hashedPassword, salt: this.encryptSalt(salt) };
    }

    public static encryptSalt(salt: string): string {
        return Buffer.from(salt).toString('base64');
    }

    public static decryptSalt(hashedSalt: string): string {
        return Buffer.from(hashedSalt, 'base64').toString();
    }

    private static generateSalt(): string {
        const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/';
        let randomString = '';
        for (let i = 0; i < 128; ++i)
            randomString += allowedChars[randomInt(0, allowedChars.length - 1)];
        return randomString;
    }
}