const express = require('express')
const router = express.Router()
const fs = require('fs')

router.get('/rtc', (req, res) => {
    fs.readFile('views/rtc.ejs', (err, data) => {
        if (err) {
            console.log('error')
            res.send('error')
        }
        else {
            res.writeHead(200, { 'Content-type': 'text/html' })
            res.write(data)
            res.end()
        }
    })
})

module.exports = router