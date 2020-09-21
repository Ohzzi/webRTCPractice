const express = require('express')
const router = express.Router()
const mariaDB = require('mariadb')
const select = require('../../models/signup/select')

/* 
const pool = mariaDB.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'dhwlgns97@',
    database: 'webrtc'
})
 */

router.get('/', (req, res) => {
    res.render('signup')
})

router.post('/', (req, res) => {
    const body = req.body
    const id = body.id
    const pw = body.password
    const name = body.name
    const email = body.email
    select(name)
})

module.exports = router