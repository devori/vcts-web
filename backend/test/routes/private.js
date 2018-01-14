const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const supertest = require('supertest');
const { expect } = require('chai');
const privateRouter = require('../../app/routes/private');

describe('routes/private', function () {
  const USERNAME = 'test-user';

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
        .end((err) => {
          if (err) {
            expect.fail('', '', err);
            return;
          }
          done();
        });
    });
  });

  describe('after login', function () {
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
        .end((err) => {
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
