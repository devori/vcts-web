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
  let market = req.params.market;
  let nonce = new Date().getTime();
  let sign = crypto.getHashSha512(req.session.vctsKey.secretKey, `nonce=${nonce}`);

  request({
    method: 'GET',
    url: `${VCTS_API_URL}/private/markets/${market}/assets`,
    headers: {
      nonce,
      sign,
      'api-key': req.session.vctsKey.apiKey
    }
  }, (err, vctsRes, body) => {
    if (vctsRes.statusCode !== 200) {
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

module.exports = router;
