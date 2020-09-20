const express = require('express')
const router = express.Router()
const signUp = require('./signup/index')

router.get('/', (req, res) => {
    res.render('index')
})

router.use('/signup', signUp)

module.exports = router