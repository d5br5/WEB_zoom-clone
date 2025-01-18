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
const io = new Server(httpServer);

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
