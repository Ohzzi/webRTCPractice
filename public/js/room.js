const socket = io();

//socket.emit('join-room', ROOM_ID, 10);

/*socket.on('user-connected', (userID) => {
    console.log(`user connected: ${userID}`);
})*/

socket.emit('join-room');

const videoGrid = document.getElementById('video-grid');
const constraints = {
    'video': true,
    'audio': true
}
const myVideo = document.createElement('video');

const pcConfig = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
    }, {
        url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
    }]
}

const peerConnection = new RTCPeerConnection(pcConfig);

function setPeerConnection() {
    peerConnection.onicecandidate = handleIceCandidate;
    peerConnection.onaddstream = handleRemoteStream;
}

function handleIceCandidate(event) {
    if (event.candidate) {
        socket.emit({
            'new-ice-candidate': event.candidate
        });
    }
}

function handleRemoteStream(event) {
}

function startButtonPressed() {
    playLocalVideo();
    getRemoteVideo();
}

const track = new MediaStream();

async function playLocalVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Got MediaStream', stream);
        addVideoStream(myVideo, stream);
        peerConnection.addTrack(track, stream);
    } catch (error) {
        console.log('Error: ', error);
    }
}

async function getRemoteVideo() {

}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}