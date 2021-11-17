export class Utils {
    public static getTokenFromAuthHeader(authHeader: string): string | null {
        const parts = authHeader.split(' ');
        if (parts.length != 2) {
            return null;
        }

        if (parts[0] != 'Bearer') {
            return null;
        }

        return parts[1];
    }

    public static isFiniteNumber(number: number): boolean {
        return !isNaN(number) && isFinite(number);
    }
}