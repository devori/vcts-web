const express = require('express');
const router = express.Router();
const request = require('request');
const {VCTS_API_URL} = require('../../properties');

router.get('/:base?', (req, res) => {
    const {username, market} = res.locals;
    const {base} = req.params;
    const url = `${VCTS_API_URL}/private/users/${username}/markets/${market}/assets`;

    request({
        url: url + (base ? `/${base}` : '')
    }).on('error', (err) => res.status(500).send(err))
        .pipe(res);
});

router.delete('/:base/:vcType/:id', (req, res) => {
    const {username, market} = res.locals;
    const {base, vcType, id} = req.params;

    request({
        url: `${VCTS_API_URL}/private/users/${username}/markets/${market}/assets/${base}/${vcType}/${id}`,
        method: 'DELETE'
    }).on('error', (err) => res.status(500).send(err))
        .pipe(res);
});

router.put('/:base/:vcType', (req, res) => {
    const {username, market} = res.locals;
    const {base, vcType} = req.params;
    const {mode} = req.query;
    const {ids} = req.body;

    request({
        url: `${VCTS_API_URL}/private/users/${username}/markets/${market}/assets/${base}/${vcType}`,
        method: 'PUT',
        qs: {mode},
        json: true,
        body: ids,
    }).on('error', (err) => res.status(500).send(err))
        .pipe(res);
});

module.exports = router;