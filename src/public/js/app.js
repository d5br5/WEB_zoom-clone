// 고유 ID 생성 함수
function generateClientId() {
  return Math.random().toString(36).substring(2, 11);
}

// sessionStorage에서 clientId 확인 또는 생성
function getClientId() {
  let clientId = sessionStorage.getItem("clientId");
  if (!clientId) {
    clientId = generateClientId();
    sessionStorage.setItem("clientId", clientId);
  }
  return clientId;
}

// WebSocket 연결
let nickname = "noname";
const clientId = getClientId();

const messageList = document.querySelector("ul");
const messageForm = document.getElementById("message-form");
const nicknameForm = document.getElementById("nickname-form");

const socket = new WebSocket(
  `ws://${window.location.host}?clientId=${clientId}`
);

socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

const makeMessage = (type, payload) => JSON.stringify({ type, payload });

const addMessage = ({ clientId, message }) => {
  const li = document.createElement("li");
  li.innerText = `${clientId}: ${message}`;
  messageList.append(li);
};

socket.addEventListener("message", (message) => {
  const data = JSON.parse(message.data);
  const { type } = data;
  if (type === "history") {
    data.payload.chatList.forEach(addMessage);
  }
  if (type === "message") {
    addMessage(data);
  }
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  const message = input.value;
  socket.send(makeMessage("message", message));
  addMessage({ clientId, message });
  input.value = "";
});

const handleNicknameSubmit = (event) => {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  nickname = input.value;
  socket.send(makeMessage("nickname", nickname));
};

nicknameForm.addEventListener("submit", handleNicknameSubmit);
