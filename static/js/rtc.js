let localVideo = document.getElementById('localVideo'),
    remoteVideo = document.getElementById('remoteVideo'),
    localstream,
    isInitiator = false,
    isChannelReady = false,
    isStarted = false,
    localStream,
    remoteStream,
    pc

let socket = io()

socket.on('connect', () => {
    socket.emit('send', 'connected')
})

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
})
    .then(gotStream)
    .catch((error) => {
        console.log(error)
        alert(error)
    })

function gotStream(stream) {
    console.log("Adding local stream")
    localStream = stream;
    localVideo.srcObject = stream;
    sendMessage("got user media")
    if (isInitiator) {
        maybeStart()
    }
}

function sendMessage(message) {
    console.log('Client sending message: ', message)

}