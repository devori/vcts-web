const request = require('request');
const { VCTS_API_URL } = require('../properties');
const userDB = require('../database/users');

module.exports = {
  createAccount (info) {
    return new Promise((resolve, reject) => {
      if (!info || !info.username || !info.password) {
        reject('Arguments error');
      } else if (userDB.findByUsername(info.username)) {
        reject('Duplicated username');
      } else {
        request.post({
          url: `${VCTS_API_URL}/public/accounts`,
          json: true,
          body: {
            username: info.username
          }
        }, (err, res, body) => {
          if (res.statusCode === 201) {
            let userInfo = userDB.create({
              username: info.username,
              password: info.password,
              vcts: {
                apiKey: body.apiKey,
                secretKey: body.secretKey
              }
            });
            resolve({ username: userInfo.username });
          } else {
            reject('error');
          }
        });
      }
    });
  },
  findByUsername (username) {
    return userDB.findByUsername(username);
  }
}
