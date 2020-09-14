const express = require('express')
const socket = require('socket.io')
const https = require('https')
const fs = require('fs')
const app = express()
const io = require('socket.io')
const router = require(__dirname + '/router/main.js')

const option = {
    key: fs.readFileSync('C:/Users/오지훈/Desktop/Jihoon/ssl/localhost_private.key'),
    cert: fs.readFileSync('C:/Users/오지훈/Desktop/Jihoon/ssl/localhost.crt')
}

const bodyParser = require('body-parser')

app.use(express.static(__dirname + '/static'))
app.use(bodyParser.urlencoded({extended:false}))
app.use('/', router)

/*app.post('/', (req, res) => {
    res.send('router')
    fs.readFile(__dirname + '/static/index.html', (err,data) => {
        if(err) {
            console.log('error')
        }
        else {
            res.writeHead(200, {'Content-type': 'text/html'})
            res.write(data)
            res.end()
        }
    })
})*/

https.createServer(option, app).listen(3000, (req, res) => {
    console.log('server start')
})