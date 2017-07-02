const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');
const supertest = require('supertest');
const sinon = require('sinon');
const { expect, should } = require('chai')
const publicRouter = require('../../app/routes/public');
const userDB = require('../../app/database/users')

describe('routes/public', function () {
  const USERNAME = 'test-user';
  const CORRECT_PASSWORD = 'correct-password';
  const HASHED_PASSWORD = 'correct-password';
  const INCORRECT_PASSWORD = 'incorrect-password';

  let app;
  let mockUserDB;
  before(() => {
    mockUserDB = sinon.mock(userDB);

    sinon.stub(userDB, 'findByUsername').withArgs(USERNAME).returns({
      password: 'a17dc62b00435621bb222098732e5901dbfcd571dad906dbbc36ad5f479ab29f860b0fc4bcde10bc80f8d057c0f52bcc40ae043ecd095e0fe1114ee7e73a354c'
    });

    app = express();
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }
    }));
    app.use(bodyParser.json());
    app.use('/', publicRouter);
  });

  it(`when users/${USERNAME} call with password using post, should return success result with 201 code`, done => {
    let expectation = mockUserDB.expects('create');
    expectation.once();
    supertest(app)
      .post(`/users/${USERNAME}`)
      .send({
        password: CORRECT_PASSWORD
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201)
      .end((err, res) => {
        if (err) {
          expect.fail('', '', err);
          return;
        }
        expect(res.body.status).to.equal('success');
        expect(res.body.result).to.equal('Success');

        expectation.verify();
        done();
      });
    this.timeout(3000);
  });

  it(`when users/${USERNAME}/session call with correct password using post, should return success`, done => {
    supertest(app)
      .post(`/users/${USERNAME}/session`)
      .send({
        password: CORRECT_PASSWORD
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) {
          expect.fail('', '', err);
          return;
        }
        expect(res.body.status).to.equal('success');
        expect(res.body.result).to.equal('Success');

        done();
      });
    this.timeout(3000);
  });

  it(`when users/${USERNAME}/session call with incorrect password using post, should return failure with message`, done => {
    supertest(app)
      .post(`/users/${USERNAME}/session`)
      .send({
        password: INCORRECT_PASSWORD
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) {
          expect.fail('', '', err);
          return;
        }
        expect(res.body.status).to.equal('failure');
        expect(res.body.result).to.equal('Incorrect Password');

        done();
      });
    this.timeout(3000);
  });

  after(() => {
    mockUserDB.restore();
    userDB.findByUsername.restore();
  });
});
