import { pbkdf2 } from 'fast-sha256';
import { randomInt } from 'crypto';
import { TextDecoder, TextEncoder } from 'util';

export function generateSalt(): string {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/';
    let randomString = '';
    for (let i = 0; i < 128; ++i)
        randomString += allowedChars[randomInt(0, allowedChars.length - 1)];
    return randomString;
}

export function hashSalt(salt: string): string {
    return Buffer.from(salt).toString('base64');
}

export function unhashSalt(hashedSalt: string): string {
    return Buffer.from(hashedSalt, 'base64').toString();
}

export function hashPassword(password: string, salt: string): string {
    return new TextDecoder().decode(pbkdf2(new TextEncoder().encode(password), new TextEncoder().encode(salt), 10000, 128));
}
