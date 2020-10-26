const express = require('express');
const router = express.Router();
const room = require('./room/index');

router.get('/', (req, res) => {
    res.render('index');
});

router.use('/room', room);

module.exports = router;