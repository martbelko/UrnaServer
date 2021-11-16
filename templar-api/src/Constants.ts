import dotenv from 'dotenv';

dotenv.config();

export class Constants {
    static readonly MIN_PASSWORD_LEN = 8;
    static readonly MAX_PASSWORD_LEN = 100;

    static readonly STEAM_ID_REGEG = new RegExp(/^STEAM_[0-5]:[01]:\d+$/);

    static readonly MIN_IMMUNITY = 0;
    static readonly MAX_IMMUNITY = 100;

    static readonly IP_REGEX = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);

    static readonly MIN_USERNAME_LEN = 6;
    static readonly MAX_USERNAME_LEN = 100;

    // eslint-disable-next-line no-useless-escape
    static readonly EMAIL_REGEX = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    static readonly ALLOWED_USERNAME_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    static readonly REST_PORT = Number(process.env.PORT);

    static readonly ACCESS_TOKEN_EXPIRATION = 60; // Seconds
    static readonly REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 7; // 1 week
}
