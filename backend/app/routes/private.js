const express = require('express');
const router = express.Router();
const request = require('request');
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
  let url = `${VCTS_API_URL}/private/users/${username}/markets/${market}/assets`;
  if (req.params.base) {
    url += `/${req.params.base}`
  }

  request({
    url,
    method: 'GET'
  }, (err, vctsRes, body) => {
    if (err) {
      res.status(500).send(body);
      return;
    }
    res.send(body);
  });
});

router.delete('/markets/:market/assets/:base/:vcType/:id', (req, res) => {
  let username = req.session.username;
  let { market, base, vcType, id } = req.params;
  let url = `${VCTS_API_URL}/private/users/${username}/markets/${market}/assets/${base}/${vcType}/${id}`;

  request({
    url,
    method: 'DELETE'
  }, (err, vctsRes, body) => {
    if (err) {
      res.status(500).send(body);
      return;
    }
    res.send(body);
  });
});

router.put('/markets/:market/assets/:base/:vcType', (req, res) => {
  const { username } = req.session;
  const { market, base, vcType } = req.params;
  const { mode } = req.query;
  if (mode === 'merge') {
    const { ids } = req.body;
    request({
      url: `${VCTS_API_URL}/private/users/${username}/markets/${market}/assets/${base}/${vcType}`,
      method: 'PUT',
      qs: {mode: 'merge'},
      json: true,
      body: ids,
    }, (err, vctsRes, body) => {
      if (err) {
        res.status(500).send(body);
        return;
      }
      res.send(body);
    })
  }
});

router.get('/markets/:market/histories/:base?/:vcType?', (req, res) => {
  let username = req.session.username;
  let { market, base, vcType } = req.params;
  let url = `${VCTS_API_URL}/private/users/${username}/markets/${market}/histories`;
  if (base) {
    url += `/${base}`;
    if (vcType) {
      url += `/${vcType}`
    }
  }

  request({
    url,
    method: 'GET'
  }, (err, vctsRes, body) => {
    if (err) {
      res.status(500).send(body);
      return;
    }
    res.send(body);
  });
});

router.get('/markets/:market/tickers/:base?/:vcType?', (req, res) => {
  let { market, base, vcType } = req.params;
  let url = `${VCTS_API_URL}/public/markets/${market}/tickers`;
  if (base) {
    url += `/${base}`;
    if (vcType) {
      url += `/${vcType}`;
    }
  }

  request({
    url,
    method: 'GET'
  }, (err, vctsRes, body) => {
    if (err) {
      res.status(500).send(body);
      return;
    }
    res.send(body);
  });
});

router.get('/auto-traders', (req, res) => {
  let url = `${VCTS_AT_API_URL}/private/users/${req.session.username}/auto-traders`;
  request({url, method: 'GET'}, (err, vctsRes, body) => {
    if (err) {
      res.status(500).send(body);
      return;
    }
    res.send(body);
  });
});

router.post('/auto-traders/:market/:base', (req, res) => {
  const {market, base} = req.params;
  const url = `${VCTS_AT_API_URL}/private/users/${req.session.username}/auto-traders/${market}/${base}`;

  request({
    url,
    method: 'POST',
    json: true,
    body: req.body,
  }, (err, vctsRes, body) => {
    if (err || vctsRes.statusCode >= 400) {
      res.status(500).send(body);
      return;
    }
    res.sendStatus(201);
  });
});

router.delete('/auto-traders/:market/:base', (req, res) => {
  const {market, base} = req.params;
  let url = `${VCTS_AT_API_URL}/private/users/${req.session.username}/auto-traders/${market}/${base}`;
  request({url, method: 'DELETE'}, (err, vctsRes, body) => {
    if (err) {
      res.status(500).send(body);
      return;
    }
    res.sendStatus(200);
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
