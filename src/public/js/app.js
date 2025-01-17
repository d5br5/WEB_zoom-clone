const socket = io();

const welcome = document.querySelector("#welcome");
const roomNameform = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = welcome.querySelector("input");
  roomName = input.value;
  socket.emit("enter_room", { payload: input.value }, showRoom);
  input.value = "";

  const messageForm = room.querySelector("form");
  messageForm.addEventListener("submit", handleMessageSubmit);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("input");
  const msg = input.value;
  socket.emit("new_message", { payload: msg, room: roomName }, () => {
    addMessage(`You: ${msg}`);
  });
  input.value = "";
};

roomNameform.addEventListener("submit", handleRoomSubmit);

const addMessage = (message) => {
  const messageList = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  messageList.appendChild(li);
};

socket.on("welcome", () => {
  addMessage("someone joined!");
});

socket.on("new_message", addMessage);

socket.on("bye", () => {
  addMessage("someone left ㅠㅠ");
});
