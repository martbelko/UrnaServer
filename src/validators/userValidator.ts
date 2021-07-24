const minUserNameLen = 6;
const maxUserNameLen = 100;

const allowedNameChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

// eslint-disable-next-line no-useless-escape
const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export function validateUserName(name: string): string | null {
    if (name == undefined || name == null)
        return 'Name was null';

    if (name.length < minUserNameLen)
        return `Name needs to contain at least ${minUserNameLen} characters. Contains: ${name.length}`;
    if (name.length > maxUserNameLen)
        return `Name needs to contain maximum ${maxUserNameLen} characters. Contains: ${name.length}`;

    for (const ch of name) {
        if (!allowedNameChars.includes(ch))
            return `Name contains invalid char '${ch}'`;
    }

    return null;
}

export function validateUserEmail(email: string): string | null {
    if (email == undefined || email == null)
        return 'Email was null';

    return emailRegex.test(email) ? null : 'Invalid email format';
}
