const express = require('express');
const router = express.Router();
const request = require('request');
const {VCTS_AT_API_URL} = require('../../properties');

router.get('/', (req, res) => {
    const {username} = res.locals;
    let url = `${VCTS_AT_API_URL}/private/users/${username}/auto-traders`;
    request(url)
        .on('error', (err) => res.status(500).send(err))
        .pipe(res);
});

router.post('/:market/:base', (req, res) => {
    const {username} = res.locals;
    const {market, base} = req.params;
    const url = `${VCTS_AT_API_URL}/private/users/${username}/auto-traders/${market}/${base}`;

    request({url, method: 'POST', json: true, body: req.body})
        .on('error', (err) => res.status(500).send(err))
        .pipe(res);
});

router.delete('/:market/:base', (req, res) => {
    const {username} = res.locals;
    const {market, base} = req.params;
    const url = `${VCTS_AT_API_URL}/private/users/${username}/auto-traders/${market}/${base}`;

    request({url, method: 'DELETE'})
        .on('error', (err) => res.status(500).send(err))
        .pipe(res);
});

module.exports = router;