let localVideo = document.getElementById('localVideo'),
    remoteVideo = document.getElementById('remoteVideo'),
    isInitiator = false,
    isChannelReady = false,
    isStarted = false,
    localStream,
    remoteStream,
    pc

const socket = io.connect()

const pcConfig = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
      },{
        url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
    }]
}

let room = 'foo';

  if(room !==''){
    socket.emit('create or join',room);
    console.log('Attempted to create or join Room',room);
  }

socket.on('created', (room,id)=>{
    console.log('Created room' + room+'socket ID : '+id);
    isInitiator= true;
  })
  
  socket.on('full', room=>{
    console.log('Room '+room+'is full');
  });

socket.on('connect', () => {
    socket.emit('send', {message: 'connected'})
})

socket.on('join',room=>{
    console.log('Another peer made a request to join room' + room);
    console.log('This peer is the initiator of room' + room + '!');
    isChannelReady = true;
  })
  
  socket.on('joined',room=>{
    console.log('joined : '+ room );
    isChannelReady= true;
  })
  socket.on('log', array=>{
    console.log.apply(console,array);
  });

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
    .then(gotStream)
    .catch((error) => {
        console.log(error)
        alert(error)
    })

function gotStream(stream) {
    console.log("Adding local stream")
    localStream = stream
    localVideo.srcObject = stream
    sendMessage("got user media")
    if (isInitiator) {
        maybeStart()
    }
}

function sendMessage(message) {
    console.log("Client sending message: ", message)
    socket.emit('message', message)
}

function createPeerConnection() {
    try {
        pc = new RTCPeerConnection(pcConfig)
        pc.onicecandidate = handleIceCandidate
        pc.onaddstream = handleRemoteStreamAdded
        //pc.onremovestream = handleRemoteStreamRemoved
    } catch (error) {
        console.log("Failed to create PeerConnection, exception: ", error.message)
        alert("Cannot create PeerConnection object")
        return
    }
}

function handleIceCandidate(event) {
    console.log("iceCandidateEvent", event)
    if (event.candidate) {
        sendMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
        })
    } else {
        console.log("end of candidates")
    }
}

function maybeStart() {
    console.log(">>>>>> maybeStart()", isStarted, localStream, isChannelReady)
    if (!isStarted && typeof (localStream) !== 'undefined' && isChannelReady) {
        console.log(">>>>>> Creating peer connection")
        createPeerConnection()
        pc.addStream(localStream)
        isStarted = true
        console.log('initiator', isInitiator)
        if (isInitiator) {
            doCall()
        } else {
            console.error('maybeStart not started')
        }
    }
}

function handleCreateOfferError(event) {
    console.log("createOffer() error: ", event)
}

function handleRemoteStreamAdded(event) {
    console.log("remote stream added")
    remoteStream = event.stream
    remoteVideo.srcObject = remoteStream
}

function doCall() {
    console.log("Sending offer to peer")
    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError)
}

function doAnswer() {
    console.log("Sending answer to peer")
    pc.createAnswer().then(
        setLocalAndSendMessage,
        onCreateSessionDescriptionError
    )
}

function setLocalAndSendMessage(sessionDescription) {
    pc.setLocalDescription(sessionDescription)
    sendMessage(sessionDescription)
}

function setLocalAndSendMessage(sessionDescription) {
    pc.setLocalDescription(sessionDescription)
    sendMessage(sessionDescription)
}

socket.on('message', (message)=>{
  console.log('Client received message :',message)
  if(message === 'got user media'){
    maybeStart()
  }else if(message.type === 'offer'){
    if(!isInitiator && !isStarted){
      maybeStart()
    }
    pc.setRemoteDescription(new RTCSessionDescription(message))
    doAnswer()
  }else if(message.type ==='answer' && isStarted){
    pc.setRemoteDescription(new RTCSessionDescription(message))
  }else if(message.type ==='candidate' &&isStarted){
    const candidate = new RTCIceCandidate({
      sdpMLineIndex : message.label,
      candidate:message.candidate
    })

    pc.addIceCandidate(candidate)
  }
})