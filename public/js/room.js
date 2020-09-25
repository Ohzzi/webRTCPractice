let isCaller;

const videoGrid = document.getElementById('video-grid');

const startBtn = document.getElementById('startButton');
startBtn.addEventListener('click', playLocalVideo);

const callBtn = document.getElementById('callButton');
callBtn.addEventListener('click', call);

const iceServers = {
    'iceServers': [
        {'urls': 'stun:stun.l.google.com:19302'},
        {'urls': 'stun:stun.services.mozila.com'}
    ]
}

const constraints = {
    'video': true,
    'audio': true
}

async function playLocalVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const myVideo = document.createElement('video');
        addVideoStream(myVideo, stream);
        isCaller = true;
    } catch (error) {
        console.log('error: ', error);
    }
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

function call() {
}

const socket = io();
socket.emit('create or join', ROOM_ID, USER_ID);

socket.on('created', room => {
    console.log('created');
    isCaller = true;
})