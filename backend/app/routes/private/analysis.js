const express = require('express');
const router = express.Router();
const request = require('request');
const {VCTS_ANALYSIS_API_URL} = require('../../properties');

router.get('/tickers/:market/:base', (req, res) => {
    const {market, base} = req.params;
    const {start, end} = req.query;

    const options = {
        url: `${VCTS_ANALYSIS_API_URL}/private/tickers/${market}/${base}`
    };

    if (start || end) {
        options.qs = {};
        if (start) {
            options.qs.start = start;
        }
        if (end) {
            options.qs.end = end;
        }
    }

    request(options).on('error', (err) => res.status(500).send(err))
        .pipe(res);
});

router.get('/assets/:market/:base', (req, res) => {
    const {username} = res.locals;
    const {market, base} = req.params;
    const {start, end, summary} = req.query;

    const options = {
        url: `${VCTS_ANALYSIS_API_URL}/private/assets/${username}/${market}/${base}`
    };

    if (start || end || summary) {
        options.qs = {};
        if (start) {
            options.qs.start = start;
        }
        if (end) {
            options.qs.end = end;
        }
        if (summary) {
            options.qs.summary = summary;
        }
    }

    request(options).on('error', (err) => res.status(500).send(err))
        .pipe(res);
});

module.exports = router;