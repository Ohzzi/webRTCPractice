const express = require('express');
const https = require('https');
const fs = require('fs');
const router = require(__dirname + '/router/index.js');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');

const option = {
    key: fs.readFileSync('ssl/localhost_private.key'),
    cert: fs.readFileSync('ssl/localhost.crt')
}

const server = https.createServer(option, app);
const io = require('socket.io')(server);

server.listen(3000, (req, res) => {
    console.log("Server starts!");
})

/* Set view engine */
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

/* Set public directory to static */
app.use(express.static('public'));

/* Use body-parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Use router module */
app.use('/', router);

/* Login passport */
app.use(passport.initialize());
app.use(passport.session());

/* Peer Connection */
const configuration = {
    'iceServers': [
        { 'urls': 'stun:stun.l.google.com:19302' }
    ]
};

io.sockets.on('connection', (socket) => {
    console.log('connected');
})