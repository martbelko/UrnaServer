import request from 'supertest';
import { describe } from 'mocha';

import { createServer } from '../src/server';
import BaseError from '../src/error';

const app = createServer(false);
const apis = request(app);

const INVALID_TIMESTAMP_ERROR_TITLE = 'Invalid timestamp';
const INVALID_TIMESTAMP_ERROR_TYPE = '/errors/invalid-timestamp';
const INVALID_TIMESTAMP_ERROR_STATUS = 401;
const INVALID_TIMESTAMP_ERROR_DETAIL = 'Specified timestamp was invalid';

describe('Test invalid api paths with no body', () => {
    it('GET /api/should-not-work', (done) => {
        apis.get('/api/should-not-work')
            .expect(INVALID_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != INVALID_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${INVALID_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != INVALID_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${INVALID_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != INVALID_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${INVALID_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != INVALID_TIMESTAMP_ERROR_DETAIL)
                    throw new Error(`Error: Expected error.detail ${INVALID_TIMESTAMP_ERROR_DETAIL}, got ${error.detail}`);
            })
            .end(done);
    });

    it('POST /api/should-not-work', (done) => {
        apis.post('/api/should-not-work')
            .expect(INVALID_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != INVALID_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${INVALID_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != INVALID_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${INVALID_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != INVALID_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${INVALID_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != INVALID_TIMESTAMP_ERROR_DETAIL)
                    throw new Error(`Error: Expected error.detail ${INVALID_TIMESTAMP_ERROR_DETAIL}, got ${error.detail}`);
            })
            .end(done);
    });


    it('PATCH /api/should-not-work', (done) => {
        apis.patch('/api/should-not-work')
            .expect(INVALID_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != INVALID_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${INVALID_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != INVALID_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${INVALID_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != INVALID_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${INVALID_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != INVALID_TIMESTAMP_ERROR_DETAIL)
                    throw new Error(`Error: Expected error.detail ${INVALID_TIMESTAMP_ERROR_DETAIL}, got ${error.detail}`);
            })
            .end(done);
    });

    it('PUT /api/should-not-work', (done) => {
        apis.put('/api/should-not-work')
            .expect(INVALID_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != INVALID_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${INVALID_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != INVALID_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${INVALID_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != INVALID_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${INVALID_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != INVALID_TIMESTAMP_ERROR_DETAIL)
                    throw new Error(`Error: Expected error.detail ${INVALID_TIMESTAMP_ERROR_DETAIL}, got ${error.detail}`);
            })
            .end(done);
    });

    it('DELETE /api/should-not-work', (done) => {
        apis.delete('/api/should-not-work')
            .expect(INVALID_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != INVALID_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${INVALID_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != INVALID_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${INVALID_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != INVALID_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${INVALID_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != INVALID_TIMESTAMP_ERROR_DETAIL)
                    throw new Error(`Error: Expected error.detail ${INVALID_TIMESTAMP_ERROR_DETAIL}, got ${error.detail}`);
            })
            .end(done);
    });
});

describe('Test invalid api paths with invalid timestamp', () => {
    it('GET /api/should-not-work', (done) => {
        apis.get('/api/should-not-work')
            .set('last-modified', 'abc')
            .expect(INVALID_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != INVALID_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${INVALID_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != INVALID_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${INVALID_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != INVALID_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${INVALID_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != INVALID_TIMESTAMP_ERROR_DETAIL)
                    throw new Error(`Error: Expected error.detail ${INVALID_TIMESTAMP_ERROR_DETAIL}, got ${error.detail}`);
            })
            .end(done);
    });

    it('POST /api/should-not-work', (done) => {
        apis.post('/api/should-not-work')
            .set('last-modified', 'notATimestamp')
            .expect(INVALID_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != INVALID_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${INVALID_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != INVALID_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${INVALID_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != INVALID_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${INVALID_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != INVALID_TIMESTAMP_ERROR_DETAIL)
                    throw new Error(`Error: Expected error.detail ${INVALID_TIMESTAMP_ERROR_DETAIL}, got ${error.detail}`);
            })
            .end(done);
    });

    it('PATCH /api/should-not-work', (done) => {
        apis.patch('/api/should-not-work')
            .set('last-modified', ' ')
            .expect(INVALID_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != INVALID_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${INVALID_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != INVALID_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${INVALID_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != INVALID_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${INVALID_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != INVALID_TIMESTAMP_ERROR_DETAIL)
                    throw new Error(`Error: Expected error.detail ${INVALID_TIMESTAMP_ERROR_DETAIL}, got ${error.detail}`);
            })
            .end(done);
    });

    it('PUT /api/should-not-work', (done) => {
        apis.put('/api/should-not-work')
            .set('last-modified', 'why')
            .expect(INVALID_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != INVALID_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${INVALID_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != INVALID_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${INVALID_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != INVALID_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${INVALID_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != INVALID_TIMESTAMP_ERROR_DETAIL)
                    throw new Error(`Error: Expected error.detail ${INVALID_TIMESTAMP_ERROR_DETAIL}, got ${error.detail}`);
            })
            .end(done);
    });

    it('DELETE /api/should-not-work', (done) => {
        apis.delete('/api/should-not-work')
            .set('last-modified', '641ths11')
            .expect(INVALID_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != INVALID_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${INVALID_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != INVALID_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${INVALID_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != INVALID_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${INVALID_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != INVALID_TIMESTAMP_ERROR_DETAIL)
                    throw new Error(`Error: Expected error.detail ${INVALID_TIMESTAMP_ERROR_DETAIL}, got ${error.detail}`);
            })
            .end(done);
    });
});

const EXPIRED_TIMESTAMP_ERROR_TITLE = 'Expired timestamp';
const EXPIRED_TIMESTAMP_ERROR_TYPE = '/errors/expired-timestamp';
const EXPIRED_TIMESTAMP_ERROR_STATUS = 401;

describe('Test invalid api paths with expired timestamp', () => {
    const MAXIMUM_OFFSET_SECONDS = 15;

    it('GET /api/should-not-work', (done) => {
        const expiredTimestamp = new Date(Date.now() - 15001);
        const timeNow = new Date(Date.now());

        const expectedErrorDetail = `Expired timestamp: Given timestamp ${expiredTimestamp} not within ${MAXIMUM_OFFSET_SECONDS} seconds of server time ${timeNow}`;

        apis.get('/api/should-not-work')
            .set('last-modified', expiredTimestamp.toUTCString())
            .expect(EXPIRED_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != EXPIRED_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${EXPIRED_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != EXPIRED_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${EXPIRED_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != EXPIRED_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${EXPIRED_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != expectedErrorDetail)
                    throw new Error(`Error: Expected error.detail ${expectedErrorDetail}, got ${error.detail}`);
            })
            .end(done);
    });

    it('POST /api/should-not-work', (done) => {
        const expiredTimestamp = new Date(2020, 1);
        const timeNow = new Date(Date.now());

        const expectedErrorDetail = `Expired timestamp: Given timestamp ${expiredTimestamp} not within ${MAXIMUM_OFFSET_SECONDS} seconds of server time ${timeNow}`;

        apis.post('/api/should-not-work')
            .set('last-modified', expiredTimestamp.toUTCString())
            .expect(EXPIRED_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != EXPIRED_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${EXPIRED_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != EXPIRED_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${EXPIRED_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != EXPIRED_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${EXPIRED_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != expectedErrorDetail)
                    throw new Error(`Error: Expected error.detail ${expectedErrorDetail}, got ${error.detail}`);
            })
            .end(done);
    });

    it('PATCH /api/should-not-work', (done) => {
        const expiredTimestamp = new Date(2020, 1);
        const timeNow = new Date(Date.now());

        const expectedErrorDetail = `Expired timestamp: Given timestamp ${expiredTimestamp} not within ${MAXIMUM_OFFSET_SECONDS} seconds of server time ${timeNow}`;

        apis.patch('/api/should-not-work')
            .set('last-modified', expiredTimestamp.toUTCString())
            .expect(EXPIRED_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != EXPIRED_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${EXPIRED_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != EXPIRED_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${EXPIRED_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != EXPIRED_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${EXPIRED_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != expectedErrorDetail)
                    throw new Error(`Error: Expected error.detail ${expectedErrorDetail}, got ${error.detail}`);
            })
            .end(done);
    });

    it('PUT /api/should-not-work', (done) => {
        const expiredTimestamp = new Date(2020, 1);
        const timeNow = new Date(Date.now());

        const expectedErrorDetail = `Expired timestamp: Given timestamp ${expiredTimestamp} not within ${MAXIMUM_OFFSET_SECONDS} seconds of server time ${timeNow}`;

        apis.put('/api/should-not-work')
            .set('last-modified', expiredTimestamp.toUTCString())
            .expect(EXPIRED_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != EXPIRED_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${EXPIRED_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != EXPIRED_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${EXPIRED_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != EXPIRED_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${EXPIRED_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != expectedErrorDetail)
                    throw new Error(`Error: Expected error.detail ${expectedErrorDetail}, got ${error.detail}`);
            })
            .end(done);
    });

    it('DELETE /api/should-not-work', (done) => {
        const expiredTimestamp = new Date(2020, 1);
        const timeNow = new Date(Date.now());

        const expectedErrorDetail = `Expired timestamp: Given timestamp ${expiredTimestamp} not within ${MAXIMUM_OFFSET_SECONDS} seconds of server time ${timeNow}`;

        apis.delete('/api/should-not-work')
            .set('last-modified', expiredTimestamp.toUTCString())
            .expect(EXPIRED_TIMESTAMP_ERROR_STATUS)
            .expect((res) => {
                const error = res.body.error as BaseError | undefined;
                if (error == undefined)
                    throw new Error('Error: Expected to get error in response body');
                if (error.type != EXPIRED_TIMESTAMP_ERROR_TYPE)
                    throw new Error(`Error: Expected error.type ${EXPIRED_TIMESTAMP_ERROR_TYPE}, got ${error.type}`);
                if (error.title != EXPIRED_TIMESTAMP_ERROR_TITLE)
                    throw new Error(`Error: Expected error.title ${EXPIRED_TIMESTAMP_ERROR_TITLE}, got ${error.title}`);
                if (error.status != EXPIRED_TIMESTAMP_ERROR_STATUS)
                    throw new Error(`Error: Expected error.status ${EXPIRED_TIMESTAMP_ERROR_STATUS}, got ${error.status}`);
                if (error.detail != expectedErrorDetail)
                    throw new Error(`Error: Expected error.detail ${expectedErrorDetail}, got ${error.detail}`);
            })
            .end(done);
    });
});
