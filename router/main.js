const express = require('express')
const router = express.Router()
const fs = require('fs')

const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({extended:false}))

router.get('/', (req, res) => {
    fs.readFile('/views/index.html', (err, data) => {
        if(err) {
            console.log('error')
            res.send('error')
        }
        else {
            res.writeHead(200, {'Content-type': 'text/html'})
            res.write(data)
            res.end()
        }
    })
})

router.get('/about', (req, res) => {
    fs.readFile('views/about.html', (err, data) => {
        if(err) {
            console.log('error')
            res.send('error')
        }
        else {
            res.writeHead(200, {'Content-type': 'text/html'})
            res.write(data)
            res.end()
        }
    })
})

router.get('/rtc', (req, res) => {
    fs.readFile('views/rtc.html', (err, data) => {
        if(err) {
            console.log('error')
            res.send('error')
        }
        else {
            res.writeHead(200, {'Content-type': 'text/html'})
            res.write(data)
            res.end()
        }
    })
})

module.exports = router