const express = require('express');
const bodyParser = require('body-parser')
const supertest = require('supertest');
const sinon = require('sinon');
const { expect, should } = require('chai')
const publicRouter = require('../../app/routes/public');
const userDB = require('../../app/database/users')

describe('routes/public', function () {
  let app;
  let mockUserDB;
  before(() => {
    app = express();
    app.use(bodyParser.json());
    app.use('/', publicRouter);

    mockUserDB = sinon.mock(userDB);
  });

  it('when users/test-user call with password using post, should return success result with 201 code', done => {
    let expectation = mockUserDB.expects('create');
    expectation.once();
    supertest(app)
      .post('/users/test-user')
      .send({
        password: 'test-password'
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

  after(() => {
    mockUserDB.restore();
  });
});
