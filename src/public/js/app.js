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

  const messageForm = room.querySelector("form#msg");
  messageForm.addEventListener("submit", handleMessageSubmit);

  const nameForm = room.querySelector("form#name");
  nameForm.addEventListener("submit", handleNicknameSubmit);

  const leaveBtn = room.querySelector("button#leave");
  const handleLeave = () => {
    socket.emit("leave_room", roomName, () => {
      welcome.hidden = false;
      room.hidden = true;
      roomName = null;
      leaveBtn.removeEventListener("click", handleLeave);
    });
  };
  leaveBtn.addEventListener("click", handleLeave);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = welcome.querySelector("input");
  roomName = input.value;
  socket.emit("enter_room", { payload: input.value }, showRoom);
  input.value = "";
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const msg = input.value;
  socket.emit("new_message", { payload: msg, room: roomName }, () => {
    addMessage(`You: ${msg}`);
  });
  input.value = "";
};

const handleNicknameSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", { payload: input.value });
};

roomNameform.addEventListener("submit", handleRoomSubmit);

const addMessage = (message) => {
  const messageList = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  messageList.appendChild(li);
};

socket.on("welcome", (data) => {
  addMessage(data);
});

socket.on("new_message", addMessage);

socket.on("bye", (data) => {
  addMessage(data);
});

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
    li.addEventListener("click", () => {
      socket.emit("enter_room", { payload: room }, showRoom);
      roomName = room;
    });
  });
});
