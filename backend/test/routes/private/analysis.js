const express = require('express');
const bodyParser = require('body-parser');
const supertest = require('supertest');
const nock = require('nock');
const {VCTS_ANALYSIS_API_URL} = require('../../../app/properties');
const analysisRouter = require('../../../app/routes/private/analysis');

describe('routes/private/analysis', function () {
    const USERNAME = 'test-user';
    const MARKET = 'test-market';
    const BASE = 'BTC';

    let app;

    beforeEach(() => {
        nock(VCTS_ANALYSIS_API_URL)
            .get(`/private/tickers/${MARKET}/${BASE}`)
                .query({start: '1', end: '2'})
            .reply(200, [1, 2])
            .get(`/private/assets/${USERNAME}/${MARKET}/${BASE}`)
                .query({start: '1', end: '2'})
            .reply(200, [1, 2]);

        app = express();
        app.use(bodyParser.json());
        app.use('*', (req, res, next) => {
            res.locals.username = USERNAME;
            next();
        });
        app.use('/', analysisRouter);
    });

    afterEach(() => {
        nock.cleanAll();
    });

    describe('GET /tickers/:market/:base', () => {
        it('return matched tickers', done => {
            supertest(app)
                .get(`/tickers/${MARKET}/${BASE}`)
                .query({start: '1', end: '2'})
                .expect(200, [1, 2])
                .end(done);
        });
    });


    describe('GET /assets/:market/:base', () => {
        it('return matched assets', done => {
            supertest(app)
                .get(`/assets/${MARKET}/${BASE}`)
                .query({start: '1', end: '2'})
                .expect(200, [1, 2])
                .end(done);
        });
    });
});
