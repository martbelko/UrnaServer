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

    public static validateEmail(email: string) : ValidationError | null {
        if (!Constants.EMAIL_REGEX.test(email)) {
            return ValidationError.REGEX_ERROR;
        }

        return null;
    }

    public static dateDiffMs(a: Date, b: Date): number {
        // Discard the time and time-zone information.
        const aUtc = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds());
        const bUtc = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds(), b.getMilliseconds());
        return Math.abs(a.getTime() - b.getTime());
    }
}
