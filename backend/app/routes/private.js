const express = require('express');
const router = express.Router();
const request = require('request');
const crypto = require('../util/crypto');
const { VCTS_API_URL, VCTS_AT_API_URL } = require('../properties');

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

router.get('/markets/:market/assets/:base?', (req, res) => {
  let username = req.session.username;
  let market = req.params.market;
  let url = `${VCTS_API_URL}/private/users/${username}/markets/${market}/assets`
  if (req.params.base) {
    url += `/${req.params.base}`
  }

  request({
    url,
    method: 'GET'
  }).pipe(res);
});

router.get('/markets/:market/histories/:base?/:vcType?', (req, res) => {
  let username = req.session.username;
  let { market, base, vcType } = req.params;
  let url = `${VCTS_API_URL}/private/users/${username}/markets/${market}/histories`
  if (base) {
    url += `/${base}`
    if (vcType) {
      url += `/${vcType}`
    }
  }

  request({
    url,
    method: 'GET'
  }).pipe(res)
});

router.get('/markets/:market/tickers/:base?/:vcType?', (req, res) => {
  let { market, base, vcType } = req.params;
  let url = `${VCTS_API_URL}/public/markets/${market}/tickers`
  if (base) {
    url += `/${base}`
    if (vcType) {
      url += `/${vcType}`
    }
  }

  request({
    url,
    method: 'GET'
  }).pipe(res)
});

router.get('/auto-traders', (req, res) => {
  let url = `${VCTS_AT_API_URL}/private/users/${req.session.username}/auto-traders`;
  request({url, method: 'GET'}).pipe(res);
})

router.post('/auto-traders/:name', (req, res) => {
  if (req.params.name !== 'poloniex') {
    throw 'not supported'
  }
  let url = `${VCTS_AT_API_URL}/private/users/${req.session.username}/auto-traders/poloniex`;
  request({url, method: 'POST'}).pipe(res);
})

router.delete('/auto-traders/:name', (req, res) => {
  if (req.params.name !== 'poloniex') {
    throw 'not supported'
  }
  let url = `${VCTS_AT_API_URL}/private/users/${req.session.username}/auto-traders/poloniex`;
  request({url, method: 'DELETE'}).pipe(res);
})

router.delete('/session', (req, res) => {
  req.session.destroy(err => {
    if (err) res.status(500);
    else res.status(200);
    res.send();
  });
});

module.exports = router;
