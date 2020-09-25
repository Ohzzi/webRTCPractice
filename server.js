const express = require('express');
const https = require('https');
const fs = require('fs');
const router = require(__dirname + '/router/index.js');
const app = express();
const passport = require('passport');
const port = process.env.PORT || 3000;

const option = {
    key: fs.readFileSync('ssl/localhost_private.key'),
    cert: fs.readFileSync('ssl/localhost.crt')
}

const server = https.createServer(option, app);
const io = require('socket.io')(server);

server.listen(port, (req, res) => {
    console.log("Server starts!");
})

/* Set view engine */
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

/* Set public directory to static */
app.use(express.static('public'));

/* Use body-parser */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Use router module */
app.use('/', router);

/* Login passport */
app.use(passport.initialize());
app.use(passport.session());

io.on('connection', socket => {
    console.log('user connected');

    socket.on('create or join', room => {
        const myRoom = io.sockets.adapter.rooms[room] || {length:0};
        const numClients = myRoom.length;
        console.log(room, 'has', numClients, 'clients');

        if(numClients == 0) {
            socket.join(room);
            socket.emit('created', room);
        } else if (numClients == 1) {
            socket.join(room);
            socket.emit('joined', room);
        } else {
            socket.emit('full', room);
        }
    });

    socket.on('ready', room => {
        socket.broadcast.to(room).emit('ready');
    });

    socket.on('candidate', event => {
        socket.broadcast.to(event.room).emit('candidate', event);
    });

    socket.on('offer', event => {
        socket.broadcast.to(event.room).emit('offer', event.sdp);
    });

    socket.on('answer', event => {
        socket.broadcast.to(event.room).emit('answer', event.sdp);
    });
})