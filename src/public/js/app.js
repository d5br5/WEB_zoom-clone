const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

const addMessage = (message) => {
  const li = document.createElement("li");
  li.innerText = message;
  messageList.append(li);
};

socket.addEventListener("message", (message) => {
  addMessage(message.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  addMessage(input.value);
  input.value = "";
});
