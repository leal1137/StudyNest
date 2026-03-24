const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("client"));

io.on("connection", (socket) => {
    console.log("En klient anslöt:", socket.id);

    // Ta emot meddelande från klient
    socket.on("chat message", (msg) => {
        console.log("Meddelande:", msg);

        // Skicka tillbaka till alla klienter
        io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
        console.log("Klient lämnade:", socket.id);
    });
});

// Starta server
server.listen(3000, () => {
    console.log("Server körs på http://localhost:3000");
});