const express = require('express');
const router = express.Router();
const request = require('request');
const {VCTS_API_URL} = require('../../properties');
const assetRotuer = require('./asset');
const historyRotuer = require('./history');
const autoTraderRotuer = require('./auto-trader');
const analysisRouter = require('./analysis');

router.use('*', (req, res, next) => {
    const username = req.session.username;
    if (!username) {
        res.status(401).send({
            status: 'failure',
            result: 'Unauthenticated'
        });
        return;
    }
    res.locals.username = username;
    next();
});

router.use('/markets/:market', (req, res, next) => {
    const {market} = req.params;
    res.locals.market = market;
    next();
});

router.use('/markets/:market/assets', assetRotuer);
router.use('/markets/:market/histories', historyRotuer);
router.use('/auto-traders', autoTraderRotuer);
router.use('/analysis', analysisRouter);

router.get('/markets/:market/tickers/:base?/:vcType?', (req, res) => {
    let {market, base, vcType} = req.params;
    let url = `${VCTS_API_URL}/public/markets/${market}/tickers`;
    if (base) {
        url += `/${base}`;
        if (vcType) {
            url += `/${vcType}`;
        }
    }

    request(url)
        .on('error', (err) => res.status(500).send(err))
        .pipe(res);
});

router.post('/markets/:market/order', (req, res) => {
    const {username} = res.locals;
    const {market} = req.params;
    const url = `${VCTS_API_URL}/private/users/${username}/markets/${market}/order`;

    request({
        url,
        method: 'POST',
        json: true,
        body: req.body,
    }).on('error', (err) => res.status(500).send(err))
        .pipe(res);
});

router.delete('/session', (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500);
        else res.status(200);
        res.send('');
    });
});

module.exports = router;
