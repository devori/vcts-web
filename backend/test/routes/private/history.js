const express = require('express');
const bodyParser = require('body-parser');
const nock = require('nock');
const supertest = require('supertest');
const historyRouter = require('../../../app/routes/private/history');
const {VCTS_API_URL} = require('../../../app/properties');

describe('routes/private/history', function () {
    const USERNAME = 'test-user';
    const MARKET = 'test-market';
    const BASE = 'BTC';

    let app;

    beforeEach(() => {
        nock(VCTS_API_URL)
            .get(`/private/users/${USERNAME}/markets/${MARKET}/histories/${BASE}`)
            .reply(200, {
                'ETH': [1, 2, 3]
            });

        app = express();
        app.use(bodyParser.json());
        app.use('*', (req, res, next) => {
            res.locals.username = USERNAME;
            res.locals.market = MARKET;
            next();
        });
        app.use('/', historyRouter);
    });

    afterEach(() => {
        nock.cleanAll();
    });

    describe('GET /:base?/:vcType?', () => {
        it('return histories', done => {
            supertest(app)
                .get(`/BTC`)
                .expect(200, {ETH: [1,2,3]})
                .end(done);
        });
    });
});
