const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');
const supertest = require('supertest');
const sinon = require('sinon');
const { expect, should } = require('chai');
const nock = require('nock');
const privateRouter = require('../../app/routes/private');
const { VCTS_API_URL } = require('../../app/properties');

describe('routes/private', function () {
  const USERNAME = 'test-user';
  const MARKET = 'poloniex';

  let app;
  let mockUserDB;

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
        .end((err, res) => {
          if (err) {
            expect.fail('', '', err);
            return;
          }
          done();
        });
    });
  });

  describe('after login', function () {
    const API_KEY = 'test-api-key';
    const SIGN = 'test-sign';

    before(() => {
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

    it('should logout when session exists', done => {
      supertest(app)
        .delete(`/session`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            expect.fail('', '', err);
            return;
          }
          done();
        });
    });
  });

  after(() => {
  });
});
