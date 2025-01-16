import express from "express";
import http from "http";
import ws from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/public", express.static(process.cwd() + "/src/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => {
  console.log("Server is running on port 3000");
};

const httpServer = http.createServer(app);
const wsServer = new ws.Server({ server: httpServer });

const browserSocketList = [];

wsServer.on("connection", (socket, req) => {
  const clientId = req.headers["sec-websocket-key"]; // 고유한 WebSocket 키
  console.log(`New connection: ${clientId}`);
  browserSocketList.push(socket);

  socket.on("message", (message) => {
    console.log(message.toString());
    browserSocketList.forEach((browserSocket) => {
      if (browserSocket !== socket) {
        browserSocket.send(message.toString());
      }
    });
  });
  socket.on("close", () => {
    console.log("Disconnected from the Browser");
  });
});

httpServer.listen(3000, handleListen);
