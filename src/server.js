import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/public", express.static(process.cwd() + "/src/public"));

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

io.on("connection", (socket) => {
  socket.on("join_room", async (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
