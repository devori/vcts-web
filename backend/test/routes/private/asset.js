const express = require('express');
const bodyParser = require('body-parser');
const nock = require('nock');
const supertest = require('supertest');
const assetRouter = require('../../../app/routes/private/asset');
const {VCTS_API_URL} = require('../../../app/properties');

describe('routes/private/assets', function () {
    const USERNAME = 'test-user';
    const MARKET = 'test-market';
    const BASE = 'USDT';

    let app;

    beforeEach(() => {
        nock(VCTS_API_URL)
            .get(`/private/users/${USERNAME}/markets/${MARKET}/assets/${BASE}`)
                .reply(200, {
                    'ETH': [1, 2, 3]
                })
            .delete(`/private/users/${USERNAME}/markets/${MARKET}/assets/${BASE}/ETH/1`)
                .reply(200, { uuid: 1 })
            .put(`/private/users/${USERNAME}/markets/${MARKET}/assets/${BASE}/ETH`, [1,2,3])
                .query({mode: 'merge'})
                .reply(200, { uuid: 1 });

        app = express();
        app.use(bodyParser.json());
        app.use('*', (req, res, next) => {
            res.locals.username = USERNAME;
            res.locals.market = MARKET;
            next();
        });
        app.use('/', assetRouter);
    });

    afterEach(() => {
        nock.cleanAll();
    });

    describe('GET /:base?', () => {
        it('return assets', done => {
            supertest(app)
                .get(`/USDT`)
                .expect(200, {ETH: [1,2,3]})
                .end(done);
        });
    });

    describe('DELETE /:base/:vcType/:id?', () => {
        it('return deleted asset', done => {
            supertest(app)
                .delete(`/${BASE}/ETH/1`)
                .expect(200, {uuid: 1})
                .end(done);
        });
    });

    describe('PUT /:base/:vcType', () => {
        it('return updated asset', done => {
            supertest(app)
                .put(`/${BASE}/ETH?mode=merge`)
                .send({ids: [1,2,3]})
                .expect(200, {uuid: 1})
                .end(done);
        });
    });
});
