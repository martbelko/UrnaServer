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

    public static finiteNumberOrUndefined(number: number): number | undefined {
        return this.isFiniteNumber(number) ? number : undefined;
    }

    public static validateEmail(email: string) : ValidationError | null {
        if (!Constants.EMAIL_REGEX.test(email)) {
            return ValidationError.REGEX_ERROR;
        }

        return null;
    }

    public static dateDiffMs(a: Date, b: Date): number {
        return Math.abs(a.getTime() - b.getTime());
    }
}
