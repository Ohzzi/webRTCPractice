const express = require('express')
const router = express.Router()
const select = require('../../models/signup/select')
const insert = require('../../models/signup/insert')

router.get('/', (req, res) => {
    res.render('signup')
})

router.post('/', (req, res) => {
    const body = req.body
    const id = body.id
    const pw = body.password
    const name = body.name
    const email = body.email
    //select(body)
    /*insert{
        id: id,
        pw: pw,
        name: name,
        email: email
    })*/
    insert(body)
})

module.exports = router