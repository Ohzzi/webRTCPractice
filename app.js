const express = require('express')
const socket = require('socket.io')
const https = require('https')
const fs = require('fs')

const option = {
    key: fs.readFileSync('C:/Users/오지훈/Desktop/Jihoon/ssl/localhost_private.key'),
    cert: fs.readFileSync('C:/Users/오지훈/Desktop/Jihoon/ssl/localhost.crt')
}

const app = express()

app.get('/', (req, res) => {
    res.send('hi')
})

https.createServer(option, app).listen(443, (req, res) => {
    console.log('server start')
})