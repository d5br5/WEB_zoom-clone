const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    myFace.srcObject = myStream;
  } catch (e) {
    console.log(e);
  }
}

getMedia();

const handleMuteClick = () => {
  myStream
    .getAudioTracks()
    .forEach((stream) => (stream.enabled = !stream.enabled));
  muteBtn.innerText = muted ? "Mute" : "Unmute";
  muted = !muted;
};

muteBtn.addEventListener("click", handleMuteClick);

const handleCameraClick = () => {
  myStream
    .getVideoTracks()
    .forEach((stream) => (stream.enabled = !stream.enabled));
  cameraBtn.innerText = cameraOff ? "Camera Off" : "Camera On";
  cameraOff = !cameraOff;
};

cameraBtn.addEventListener("click", handleCameraClick);
