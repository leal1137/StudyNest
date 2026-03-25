const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("client"));

io.on("connection", (socket) => {
    console.log("En användare ansluten:", socket.id);

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg); // skicka till alla
    });

    socket.on("disconnect", () => {
        console.log("Användare frånkopplad:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server kör på http://localhost:3000");
});