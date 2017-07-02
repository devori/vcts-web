const express = require('express');
const router = express.Router();

router.delete('/users/:username', (req, res) => {
  let username = req.params.username;
  req.session.destroy(() => {
    res.json({
      status: 'success',
      result: 'Logout'
    })
  });
});

module.exports = router;
