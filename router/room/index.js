const express = require('express');
const router = express.Router();
const { v4: uuidV4 } = require('uuid');

router.get('/', (req, res) => {
    res.render('room');
})

router.get('/create', (req, res) => {
    res.redirect(`/room/${uuidV4()}`);
});

router.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});

module.exports = router;