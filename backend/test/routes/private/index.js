const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const supertest = require('supertest');
const nock = require('nock');
const privateRouter = require('../../../app/routes/private');
const {VCTS_API_URL}  = require('../../../app/properties');

describe('routes/private', function () {
    const USERNAME = 'test-user';
    const MARKET = 'test-market';

    let app;

    describe('before login', () => {
        before(() => {
            app = express();
            app.use(session({
                secret: 'test-secret',
                resave: false,
                saveUninitialized: false,
                cookie: { secure: false }
            }));
            app.use(bodyParser.json());
            app.use('/', privateRouter);
        });

        it('should receive 401 when session does not exist', done => {
            supertest(app)
                .delete(`/session`)
                .expect(401)
                .end(done);
        });
    });

    describe('after login', function () {
        beforeEach(() => {

            nock(VCTS_API_URL)
                .post(`/private/users/${USERNAME}/markets/${MARKET}/order`, { side: 'buy'})
                    .reply(201, {units: 1});

            app = express();
            app.use(session({
                secret: 'test-secret',
                resave: false,
                saveUninitialized: false,
                cookie: { secure: false }
            }));
            app.use(bodyParser.json());
            app.use('/', (req, res, next) => {
                req.session.username = USERNAME;
                next();
            });
            app.use('/', privateRouter);
        });

        afterEach(() => {
            nock.cleanAll();
        });

        it('should logout when session exists', done => {
            supertest(app)
                .delete(`/session`)
                .expect(200)
                .end(done);
        });

        it('should return ordered info', (done) => {
            supertest(app)
                .post(`/markets/${MARKET}/order`)
                .send({side: 'buy'})
                .expect(201)
                .end(done);
        });
    });
});
