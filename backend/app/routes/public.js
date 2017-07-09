const express = require('express');
const crypto = require('../util/crypto');
const userDB = require('../database/users');
const router = express.Router();

const HASH_KEY = 'f49be88f-b607-428b-b5ba-413dd1abcde1';

router.post('/users/:username', (req, res) => {
  userDB.create({
    username: req.params.username,
    password: crypto.getHashSha512(HASH_KEY, req.body.password)
  });
  res.status(201).json({
    status: 'success',
    result: 'Success'
  });
});

router.get('/session', (req, res) => {
  if (req.session.username) {
    res.json({
      status: 'success',
      result: {
        username: req.session.username
      }
    })
  } else {
    res.json({
      status: 'failure',
      result: 'It does not exist'
    })
  }
})

router.post('/session', (req, res) => {
  let username = req.body.username;
  let password = crypto.getHashSha512(HASH_KEY, req.body.password);

  let userInfo = userDB.findByUsername(username);
  if (userInfo && userInfo.password === password) {
    req.session.username = username;
    req.session.vctsKey = userInfo.vctsKey
    res.json({
      status: 'success',
      result: 'Success'
    });
  } else {
    req.session.destroy();
    res.json({
      status: 'failure',
      result: 'Incorrect Username or Password'
    });
  }
});

module.exports = router;
