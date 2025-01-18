import express from "express";
import http from "http";
// import ws from "ws";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/public", express.static(process.cwd() + "/src/public"));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

app.get("/", (_, res) => res.render("home"));
// app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => {
  console.log("Server is running on port 3000");
};

const getPublicRooms = () => {
  const { sids, rooms } = io.sockets.adapter;
  const publicRooms = [];

  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      const userCountInRoom = io.sockets.adapter.rooms.get(key)?.size || 0;
      publicRooms.push({ roomName: key, count: userCountInRoom });
    }
  });
  return publicRooms;
};

io.on("connection", (socket) => {
  socket.nickname = "Anon";
  socket.emit("room_change", getPublicRooms());

  socket.onAny((event, data) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (data, done) => {
    const roomName = data.payload;
    console.log(roomName);
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", `${socket.nickname} joined!`);
    io.sockets.emit("room_change", getPublicRooms());
  });
  socket.on("new_message", (data, done) => {
    const { payload, room } = data;
    socket.to(room).emit("new_message", `${socket.nickname}: ${payload}`);
    done();
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", `${socket.nickname} left!`)
    );
  });

  socket.on("nickname", (data) => {
    socket.nickname = data.payload;
  });

  socket.on("leave_room", (roomName, done) => {
    socket.to(roomName).emit("bye", `${socket.nickname} left!`);
    socket.leave(roomName);
    done();
    io.sockets.emit("room_change", getPublicRooms());
  });
});

instrument(io, {
  auth: false,
  mode: "development",
});

httpServer.listen(3000, handleListen);
