const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express()
const router = require(__dirname + '/router/main.js')
const session = require('express-session')

const option = {
    key: fs.readFileSync('ssl/localhost_private.key'),
    cert: fs.readFileSync('ssl/localhost.crt')
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

    function log() {
        let array = ['Message from Server: ']
        array.push.apply(array,arguments)
        socket.emit('log',array)
    }

    socket.on('send', (data) => {
        console.log(data.message)
    })
    
    socket.on('disconnect', () => {
        console.log('접속 종료')
    })

    socket.on('message', (message) =>{
        log('Client said : ' , message)
        socket.broadcast.emit('message', message)
    });

    /*socket.on('create or join',room=>{
        let clientsInRoom = io.sockets.adapter.rooms[room]
        let numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0
        log('Room ' + room + ' now has ' + numClients + ' client(s)')
        
        if(numClients === 0){
            console.log('create room!')
            socket.join(room);
            log('Client ID ' + socket.id + ' created room ' + room)
            socket.emit('created',room,socket.id)
        }
        else if(numClients===1){
            console.log('join room!')
            log('Client Id' + socket.id + 'joined room' + room)
            io.sockets.in(room).emit('join',room)
            socket.join(room)
            socket.emit('joined',room,socket.id)
            io.sockets.in(room).emit('ready')
        }else {
            socket.emit('full',room);
        }
    })*/
})