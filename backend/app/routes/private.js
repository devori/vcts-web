const express = require('express');
const router = express.Router();
const request = require('request');
const crypto = require('../util/crypto');
const { VCTS_API_URL } = require('../properties');

router.all('*', (req, res, next) => {
  let username = req.session.username;
  if (!username) {
    res.status(401).send({
      status: 'failure',
      result: 'Unauthenticated'
    });
    return;
  }
  next();
});

router.get('/markets/:market/assets', (req, res) => {
  let username = req.session.username;
  let market = req.params.market;

  request({
    method: 'GET',
    url: `${VCTS_API_URL}/private/users/${username}/markets/${market}/assets`
  }, (err, vctsRes, body) => {
    if (err) {
      res.status(500).json({
        status: 'failure',
        result: 'Failure'
      });
      return;
    }
    res.json({
      status: 'success',
      result: JSON.parse(body)
    });
  });
});

router.delete('/session', (req, res) => {
  req.session.destroy(err => {
    if (err) res.status(500);
    else res.status(200);
    res.send();
  });
});

module.exports = router;
