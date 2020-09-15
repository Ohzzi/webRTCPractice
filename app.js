const express = require('express')
const io = require('socket.io')
const server = require('https')
const fs = require('fs')
const app = express()
const router = require(__dirname + '/router/main.js')
const session = require('express-session')

const option = {
    key: fs.readFileSync('C:/Users/오지훈/Desktop/Jihoon/ssl/localhost_private.key'),
    cert: fs.readFileSync('C:/Users/오지훈/Desktop/Jihoon/ssl/localhost.crt')
}

const bodyParser = require('body-parser')

/* set view engine */
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.use(express.static(__dirname + '/static'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}))

app.use('/', router)

/*
io.sockets.on('connection', (socket) => {
    socket.on('newUser', (name) => {
        console.log(`${name}님이 접속하였습니다.`)

        socket.name = name

        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: `${name}님이 접속하였습니다.`})
    })
})*/

server.createServer(option, app).listen(3000, (req, res) => {
    console.log('server start')
})