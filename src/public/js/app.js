const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameraSelect");
const audioSelect = document.getElementById("audioSelect");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
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

async function getAudio() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audios = devices.filter((device) => device.kind === "audioinput");

    const currentAudio = myStream.getAudioTracks()[0];

    audios.forEach((audio) => {
      const option = document.createElement("option");
      option.value = audio.deviceId;
      option.innerText = audio.label;

      if (currentAudio.label === audio.label) {
        option.selected = true;
        option.innerText = audio.label + " (current)";
      }

      audioSelect.appendChild(option);
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
      await getAudio();
    }
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

const handleCameraChange = async () => {
  myStream.getVideoTracks().forEach((track) => {
    track.stop();
  });

  await getMedia(cameraSelect.value);
};

cameraSelect.addEventListener("input", handleCameraChange);
