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