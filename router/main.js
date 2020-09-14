const express = require('express')
const router = express.Router()
const fs = require('fs')

const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({extended:false}))

/*router.get('/', (req, res) => {
    res.send("router")
})*/

router.get('/new', (req, res) => {
    fs.readFile('./static/new.html', (err, data) => {
        if(err) {
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