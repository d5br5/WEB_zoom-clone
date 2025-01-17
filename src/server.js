import express from "express";
import http from "http";
// import ws from "ws";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/public", express.static(process.cwd() + "/src/public"));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {});

app.get("/", (_, res) => res.render("home"));
// app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => {
  console.log("Server is running on port 3000");
};

io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("enter_room", (data, done) => {
    console.log(data);
    done();
  });
});

httpServer.listen(3000, handleListen);

// const browserSocketList = {};
// const chatList = [];

// const wsServer = new ws.Server({ server: httpServer });
// wsServer.on("connection", (socket, req) => {
//   const urlParams = new URLSearchParams(req.url.split("?")[1]);
//   const clientId = urlParams.get("clientId") || "unknown";
//   console.log(`New connection: ${clientId}`);
//   browserSocketList[clientId] = socket;

//   // 브라우저 소켓 연결시 기존 채팅 목록 전송
//   socket.send(JSON.stringify({ type: "history", payload: { chatList } }));

//   socket.on("message", (message) => {
//     const data = JSON.parse(message.toString());

//     if (data.type === "message") {
//       const payload = { clientId, message: data.payload };
//       chatList.push(payload);
//       Object.entries(browserSocketList).forEach(([id, browserSocket]) => {
//         if (id !== clientId) {
//           browserSocket.send(JSON.stringify({ type: "message", ...payload }));
//         }
//       });
//     }

//     if (data.type === "nickname") {
//       console.log(data.payload);
//     }
//   });
//   socket.on("close", () => {
//     console.log("Disconnected from the Browser");
//   });
// });
