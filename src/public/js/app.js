const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameraSelect");
const audioSelect = document.getElementById("audioSelect");

const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let myPeerConnection;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];

    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;

      if (currentCamera.label === camera.label) {
        option.selected = true;
        option.innerText = camera.label + " (current)";
      }

      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMedia(deviceId) {
  const cameraConstrains = {
    audio: true,
    video: deviceId
      ? { deviceId: { exact: deviceId } }
      : { facingMode: "user" },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(cameraConstrains);
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}

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

const handleCameraChange = async () => {
  myStream.getVideoTracks().forEach((track) => {
    track.stop();
  });

  await getMedia(cameraSelect.value);
};

cameraSelect.addEventListener("input", handleCameraChange);

// Welcome Form (join a room)

let roomName;

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

const startMedia = async () => {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
};

const handleWelcomeSubmit = async (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  roomName = input.value;
  await startMedia();
  socket.emit("join_room", roomName);
  input.value = "";
};

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code

socket.on("welcome", async () => {
  console.log("someone joined");
  const offer = await myPeerConnection.createOffer();
  console.log(myPeerConnection);
  myPeerConnection.setLocalDescription(offer);
  console.log(myPeerConnection);
  socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
  console.log("received the offer");
  console.log(myPeerConnection);
  myPeerConnection.setRemoteDescription(offer);
  console.log(myPeerConnection);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  console.log(myPeerConnection);
  socket.emit("answer", answer, roomName);
});

socket.on("answer", (answer) => {
  console.log("received the answer");
  console.log(myPeerConnection);
  myPeerConnection.setRemoteDescription(answer);
  console.log(myPeerConnection);
});

// RTC Code

function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  console.log(myPeerConnection);
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}
