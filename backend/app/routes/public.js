const express = require('express');
const crypto = require('../util/crypto');
const account = require('../account');
const router = express.Router();
const HASH_KEY = require('../properties').HASH_KEY;

router.post('/users', (req, res) => {
    account.createAccount({
        username: req.body.username,
        password: crypto.getHashSha512(HASH_KEY, req.body.password)
    }).then(() => {
        res.status(201).json({
            status: 'success',
            result: 'Success'
        });
    }).catch(e => {
        res.status(400).json({
            status: 'failure',
            result: e
        })
    });
});

router.get('/session', (req, res) => {
    if (req.session.username) {
        res.json({
            username: req.session.username
        })
    } else {
        res.status(404).json({
            status: 'failure',
            result: 'It does not exist'
        })
    }
});

router.post('/session', (req, res) => {
    let username = req.body.username;
    let password = crypto.getHashSha512(HASH_KEY, req.body.password);

    let userInfo = account.findByUsername(username);
    if (userInfo && userInfo.password === password) {
        req.session.username = username;
        req.session.vctsKey = userInfo.vcts;
        res.json({
            status: 'success',
            result: 'Success'
        });
    } else {
        req.session.destroy();
        res.status(400).json({
            status: 'failure',
            result: 'Incorrect Username or Password'
        });
    }
});

module.exports = router;
