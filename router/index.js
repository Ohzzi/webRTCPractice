const express = require('express')
const router = express.Router()
const signUp = require('./signup/index')
const room = require('./room/index')

router.get('/', (req, res) => {
    res.render('index')
})

router.use('/signup', signUp)
router.use('/room', room)

module.exports = router