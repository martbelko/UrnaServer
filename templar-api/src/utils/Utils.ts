import { Constants } from './../Constants';

export enum ValidationError {
    INVALID_LENGTH,
    REGEX_ERROR
}

export class Utils {
    public static getTokenFromAuthHeader(authHeader: string): string | null {
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            return null;
        }

        if (parts[0] !== 'Bearer') {
            return null;
        }

        return parts[1];
    }

    public static isFiniteNumber(number: number): boolean {
        return !isNaN(number) && isFinite(number);
    }

    public static validateUserName(userName: string): ValidationError | null {
        if (userName.length < Constants.MIN_USERNAME_LEN ||
            userName.length > Constants.MAX_USERNAME_LEN) {
            return ValidationError.INVALID_LENGTH;
        }

        return null;
    }

    public static validateEmail(email: string) : ValidationError | null {
        if (!Constants.EMAIL_REGEX.test(email)) {
            return ValidationError.REGEX_ERROR;
        }

        return null;
    }

    public static validatePassword(password: string): ValidationError | null {
        if (password.length < Constants.MIN_PASSWORD_LEN ||
            password.length > Constants.MAX_USERNAME_LEN) {
            return ValidationError.INVALID_LENGTH;
        }

        return null;
    }
}
