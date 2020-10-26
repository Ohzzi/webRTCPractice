
let localStream, remoteStream, pc, isCaller = false;

const videoGrid = document.getElementById('video-grid');
const remoteVideo = document.createElement('video');

const startBtn = document.getElementById('startButton');
startBtn.addEventListener('click', playLocalVideo);

const callBtn = document.getElementById('callButton');
callBtn.addEventListener('click', call);

const iceServers = {
    'iceServers': [
        { 'urls': 'stun:stun.l.google.com:19302' },
        { 'urls': 'stun:stun.services.mozila.com' }
    ]
}

const constraints = {
    'video': true,
    'audio': true
}

function playLocalVideo() {
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

socket.on('created', () => {
    const myVideo = document.createElement('video');
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            localStream = stream;
            addVideoStream(myVideo, stream);
            isCaller = true;
            console.log('created');
        })
        .catch(error => {
            console.log(error);
        });
});

socket.on('joined', room => {
    const myVideo = document.createElement('video');
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            localStream = stream;
            addVideoStream(myVideo, stream);
            socket.emit('ready', room);
            console.log('joined');
        })
        .catch(error => {
            console.log(error);
        });
});

socket.on('ready', () => {
    if (isCaller) {
        pc = new RTCPeerConnection(iceServers);
        pc.onicecandidate = onIceCandidate;
        pc.ontrack = onAddStream;
        pc.addTrack(localStream.getTracks()[0], localStream);
        pc.addTrack(localStream.getTracks()[1], localStream);
        pc.createOffer()
            .then(sessionDescription => {
                pc.setLocalDescription(sessionDescription);
                socket.emit('offer', {
                    type: 'offer',
                    sdp: sessionDescription,
                    room: ROOM_ID
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
});

socket.on('offer', event => {
    if (!isCaller) {
        pc = new RTCPeerConnection(iceServers);
        pc.onicecandidate = onIceCandidate;
        pc.ontrack = onAddStream;
        pc.addTrack(localStream.getTracks()[0], localStream);
        pc.addTrack(localStream.getTracks()[1], localStream);
        pc.setRemoteDescription(new RTCSessionDescription(event));
        pc.createAnswer()
            .then(sessionDescription => {
                pc.setLocalDescription(sessionDescription);
                socket.emit('answer', {
                    type: 'answer',
                    sdp: sessionDescription,
                    room: ROOM_ID
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
});

socket.on('answer', event => {
    pc.setRemoteDescription(new RTCSessionDescription(event));
});

socket.on('candidate', event => {
    const candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate
    });
    pc.addIceCandidate(candidate);
})

function onAddStream(event) {
    console.log(event.streams[0]);
    addVideoStream(remoteVideo, event.streams[0]);
    remoteStream = event.streams[0];
}

function onIceCandidate(event) {
    if (event.candidate) {
        console.log('sending ice candidate', event.candidate);
        socket.emit('candidate', {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            room: ROOM_ID
        });
    }
}