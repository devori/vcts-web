const express = require('express');
const bodyParser = require('body-parser');
const nock = require('nock');
const supertest = require('supertest');
const autoTraderRouter = require('../../../app/routes/private/auto-trader');
const {VCTS_AT_API_URL} = require('../../../app/properties');

describe('routes/private/auto-trader', function () {
    const USERNAME = 'test-user';
    const MARKET = 'test-market';
    const BASE = '';

    let app;

    beforeEach(() => {
        nock(VCTS_AT_API_URL)
            .get(`/private/users/${USERNAME}/auto-traders`)
                .reply(200, [1,2,3])
            .post(`/private/users/${USERNAME}/auto-traders/${MARKET}/${BASE}`, {interval: 1000})
                .reply(201, {uuid: 1})
            .delete(`/private/users/${USERNAME}/auto-traders/${MARKET}/${BASE}`)
                .reply(200, {uuid: 1});

        app = express();
        app.use(bodyParser.json());
        app.use('*', (req, res, next) => {
            res.locals.username = USERNAME;
            next();
        });
        app.use('/', autoTraderRouter);
    });

    afterEach(() => {
        nock.cleanAll();
    });

    describe('GET /', () => {
        it('return auto traders', done => {
            supertest(app)
                .get(`/`)
                .expect(200, [1,2,3])
                .end(done);
        });
    });

    describe('POST /:market/:base', () => {
        it('return created auto-trader', done => {
            supertest(app)
                .post(`/${MARKET}/${BASE}`)
                .send({interval: 1000})
                .expect(201, {uuid: 1})
                .end(done);
        });
    });

    describe('DELETE /:market/:base', () => {
        it('return removed auto-trader', done => {
            supertest(app)
                .delete(`/${MARKET}/${BASE}`)
                .expect(200)
                .end(done);
        });
    });
});
