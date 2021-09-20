import { AuthManager, refreshAccessToken } from './auth';

export enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export async function makeRequest(apiPath: string, method: RequestMethod, body: BodyInit | null | undefined): Promise<Response> {
    const date = new Date().toUTCString();
    return await fetch('http://localhost:5000/' + apiPath, {
        method: method.toString(),
        headers: {
            'Content-Type': 'application/json',
            'Last-Modified': date
        },
        body: body
    });
}

export async function makeAuthRequest(apiPath: string, method: RequestMethod, body: BodyInit | null | undefined): Promise<Response | null> {
    const fetchFunc = async () => {
        const accessToken = AuthManager.getAccessToken();
        if (accessToken == null) {
            return null; // TODO: Return error instead of null
        }

        const date = new Date().toUTCString();
        return await fetch('http://localhost:5000/' + apiPath, {
            method: method.toString(),
            headers: {
                'Content-Type': 'application/json',
                'Last-Modified': date,
                'Authorization': `Bearer ${accessToken}`
            },
            body: body
        });
    };

    const response = await fetchFunc();
    if (response != null && response.status == 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken == null) {
            return null;
        }

        AuthManager.setAccessToken(newAccessToken);
        return await fetchFunc();
    }

    return response;
}
