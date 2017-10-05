const nock = require('nock');
const sinon = require('sinon');
const { expect, should } = require('chai');
const { VCTS_API_URL } = require('../../app/properties');
const account = require('../../app/account');
const userDB = require('../../app/database/users')

describe('account/index', function () {
  const USERNAME = 'test-user';
  const CORRECT_PASSWORD = 'correct-password';
  const API_KEY = 'api-key';
  const SECRET_KEY = 'secret-key';

  let app;
  let mockUserDB;
  before(() => {
    sinon.stub(userDB, 'create').withArgs({
        username: USERNAME,
        password: CORRECT_PASSWORD,
        vcts: {
          apiKey: API_KEY,
          secretKey: SECRET_KEY
        }
      }).returns({
        username: USERNAME
      });

    nock(`${VCTS_API_URL}`)
      .post('/public/users', {
        username: USERNAME
      })
      .reply(201, {
        username: USERNAME,
        apiKey: API_KEY,
        secretKey: SECRET_KEY
      });
  });

  after(() => {
    userDB.create.restore();
    nock.restore();
  });
});
