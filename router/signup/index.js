const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.render('signup')
})

router.post('/', (req, res) => {
    const body = req.body
    const id = body.id
    const pw = body.password
    const name = body.name
    const email = body.email
})

module.exports = router