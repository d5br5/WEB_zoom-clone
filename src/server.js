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

wsServer.on("connection", (socket, req) => {
  socket.on("message", (message) => {
    console.log(message.toString());
  });
  socket.send("hello");
  socket.on("close", () => {
    console.log("Disconnected from the Browser");
  });
});

httpServer.listen(3000, handleListen);
