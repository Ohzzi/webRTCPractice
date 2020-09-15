const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express()
const router = require(__dirname + '/router/main.js')
const session = require('express-session')

const option = {
    key: fs.readFileSync('C:/Users/오지훈/Desktop/Jihoon/ssl/localhost_private.key'),
    cert: fs.readFileSync('C:/Users/오지훈/Desktop/Jihoon/ssl/localhost.crt')
}

const bodyParser = require('body-parser')

const server = https.createServer(option, app)
server.listen(3000, (req, res) => {
    console.log('server start')
})

const io = require('socket.io').listen(server)

/* set view engine */
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))
//app.use(express.static(__dirname + '/static'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}))

app.use('/', router)

io.sockets.on('connection', (socket) => {
    console.log('유저 접속 됨')
    
    socket.on('disconnect', () => {
        console.log('접속 종료')
    })
})