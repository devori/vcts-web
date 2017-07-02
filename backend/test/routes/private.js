const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');
const supertest = require('supertest');
const sinon = require('sinon');
const { expect, should } = require('chai');
const nock = require('nock');
const privateRouter = require('../../app/routes/private');
const { VCTS_API_URL } = require('../../app/properties');

describe('routes/public', function () {
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

    it(`when /markets/${MARKET}/assets should return failure with 401`, done => {
      supertest(app)
        .get(`/markets/${MARKET}/assets`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(401)
        .end((err, res) => {
          if (err) {
            expect.fail('', '', err);
            return;
          }
          expect(res.body.status).to.equal('failure');
          expect(res.body.result).to.equal('Unauthenticated');

          done();
        });
      this.timeout(3000);
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

      nock(`${VCTS_API_URL}`, {
        reqheaders: {
          nonce: value => {
            if (!value || Number(value) < new Date().getTime() -3000) {
              return false;
            }
            return true;
          },
          "api-key": value => !!value,
          "sign": value => !!value
        }
      })
      .get(`/private/markets/${MARKET}/assets`)
      .reply(200, {
        "USDT": {
          "BTC": [
            {
              "base": "USDT",
              "vcType": "BTC",
              "units": 0.4,
              "price": 2500,
              "timestamp": 123,
              "uuid": "265dac7d-1aaa-46b0-9f46-6dac2f45f44f"
            },
            {
              "base": "USDT",
              "vcType": "BTC",
              "units": 0.4,
              "price": 2500,
              "timestamp": 123,
              "uuid": "3f70c6a7-6898-48b4-b4e5-8944d87a66cd"
            }
          ]
        }
      });
    });

    it(`when /markets/${MARKET}/assets, should return result with 200`, done => {
      supertest(app)
        .get(`/markets/${MARKET}/assets`)
        .set('nonce', new Date().getTime())
        .set('api-key', API_KEY)
        .set('sign', SIGN)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          if (err) {
            expect.fail('', '', err);
            return;
          }
          expect(res.body.status).to.equal('success');
          expect(res.body.result.USDT).to.exist;
          expect(res.body.result.USDT.BTC).to.exist;
          expect(res.body.result.USDT.BTC.length).to.equal(2);

          done();
        });
      this.timeout(3000);
    });
  });

  after(() => {
  });
});
