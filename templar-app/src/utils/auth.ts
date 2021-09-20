import { makeRequest, RequestMethod } from './request';

export class AuthManager {
    public static setUserid(userid: number): void {
        localStorage.setItem('userid', userid.toString());
    }

    public static getUserid(): number | null {
        const numStr = localStorage.getItem('userid');
        if (numStr == null) {
            return null;
        }

        return Number(numStr);
    }

    public static setAccessToken(accessToken: string): void {
        localStorage.setItem('accessToken', accessToken);
    }

    public static getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    public static setRefreshToken(refreshToken: string): void {
        localStorage.setItem('refreshToken', refreshToken);
    }

    public static getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }
}

export async function refreshAccessToken(): Promise<string | null> {
    const response = await makeRequest('auth/token', RequestMethod.POST, JSON.stringify({
        token: AuthManager.getRefreshToken()
    }));

    if (response.ok) {
        const json = await response.json();
        if (json.error != undefined) {
            return null;
        }

        return json.accessToken;
    }

    return null;
}
