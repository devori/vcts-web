const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const supertest = require('supertest');
const sinon = require('sinon');
const crypto = require('crypto');
const publicRouter = require('../../app/routes/public');
const account = require('../../app/account');

function hash(str) {
    const hash = crypto.createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
}

describe('routes/public', function () {
    const TIMESTAMP = 123;
    const USERNAME = 'test-user';
    const CORRECT_PASSWORD = 'correct-password';
    const INCORRECT_PASSWORD = 'incorrect-password';
    const HASHED_PASSWORD_WITH_TIMESTAMP = hash(hash(CORRECT_PASSWORD) + TIMESTAMP)

    let app;
    before(() => {
        sinon.stub(account, 'createAccount').withArgs({
            username: USERNAME,
            password: sinon.match.string
        }).returns(Promise.resolve({username: USERNAME}));

        sinon.stub(account, 'findByUsername').withArgs(USERNAME).returns({
            password: '9246aa9be8de7b40d64eb664986430793b6cc13a19d2a456981e44f28303f9cf'
        });

        app = express();
        app.use(session({
            secret: 'test-secret',
            resave: false,
            saveUninitialized: false,
            cookie: {secure: false}
        }));
        app.use(bodyParser.json());
        app.use('/', publicRouter);
    });

    it(`when users call with username and password using post, should return success result with 201 code`, done => {
        supertest(app)
            .post('/users')
            .send({
                username: USERNAME,
                password: CORRECT_PASSWORD
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(201, {status: 'success', result: 'Success'})
            .end(done);
    });

    it(`when /sessions call with username and correct password using post, should return success`, done => {
        supertest(app)
            .post('/session')
            .send({
                timestamp: TIMESTAMP,
                username: USERNAME,
                password: HASHED_PASSWORD_WITH_TIMESTAMP
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, {status: 'success', result: 'Success'})
            .end(done);
    });

    it(`when /session call with incorrect password using post, should return failure with message`, done => {
        supertest(app)
            .post(`/session`)
            .send({
                timestamp: TIMESTAMP,
                username: USERNAME,
                password: INCORRECT_PASSWORD
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400, {status: 'failure', result: 'Incorrect Username or Password'})
            .end(done);
    });

    it('should failure code when session does not exist and /session call', done => {
        supertest(app)
            .get(`/session`)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404, {status: 'failure', result: 'It does not exist'})
            .end(done);
    });

    after(() => {
        account.createAccount.restore();
        account.findByUsername.restore();
    });
});
