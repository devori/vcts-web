const express = require('express');
const router = express.Router();
const request = require('request');
const {VCTS_API_URL} = require('../../properties');

router.get('/:base?', (req, res) => {
    const {username, market} = res.locals;
    const {base} = req.params;
    const {start, end} = req.query;

    let url = `${VCTS_API_URL}/private/users/${username}/markets/${market}/histories`;
    if (base) {
        url += `/${base}`;
    }

    request({url, qs: {start, end}})
        .on('error', (err) => {
            res.status(500).send(err);
        })
        .pipe(res);
});

module.exports = router;