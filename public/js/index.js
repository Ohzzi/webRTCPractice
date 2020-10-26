const joinButton = document.getElementById('joinButton');

joinButton.addEventListener('click', join);

function join() {
    const roomNumber = document.getElementById('roomNumber').value;
    location.href=`room/${roomNumber}`;
}