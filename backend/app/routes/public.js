const express = require('express');
const crypto = require('crypto');
const account = require('../account');
const router = express.Router();

router.post('/users', (req, res) => {
    const hash = crypto.createHash('sha256');
    hash.update(req.body.password);
    account.createAccount({
        username: req.body.username,
        password: hash.digest('hex'),
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
    const hash = crypto.createHash('sha256');

    const timestamp = req.body.timestamp;
    const username = req.body.username;
    const password = req.body.password

    const userInfo = account.findByUsername(username);
    if (userInfo) {
        hash.update(userInfo.password + timestamp);
        if (hash.digest('hex') === password) {
            req.session.username = username;
            req.session.vctsKey = userInfo.vcts;
            res.json({
                status: 'success',
                result: 'Success'
            });

            return;
        }
    }

    req.session.destroy();
    res.status(400).json({
        status: 'failure',
        result: 'Incorrect Username or Password'
    });
});

module.exports = router;
