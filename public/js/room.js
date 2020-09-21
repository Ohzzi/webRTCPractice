const videoGrid = document.getElementById('video-grid')
const constraints = {
    'video': true,
    'audio': true
}
const myVideo = document.createElement('video')

function startButtonPressed() {
    playLocalVideo()
}
/* async */
async function playLocalVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        console.log('Got MediaStream', stream)
        addVideoStream(myVideo, stream)
    } catch (error) {
        console.log('Error: ', error)        
    }
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}