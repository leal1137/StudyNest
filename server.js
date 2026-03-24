const express = require('express');
const http = require('http'); // Required to wrap Express
const { Server } = require('socket.io'); // Import Socket.IO

const app = express();
const server = http.createServer(app); // Wrap the Express app
const io = new Server(server); // Attach Socket.IO to the server

const PORT = 3000;

// Serve the frontend files
app.use(express.static('public'));

// Listen for new Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected! Their ID is:', socket.id);

    // Listen for incoming messages from this specific user
    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);
        
        // Broadcast the message to EVERYONE who is connected
        io.emit('chat message', msg);
    });

    // Detect when a user closes their browser tab
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// VERY IMPORTANT: Use server.listen here, NOT app.listen!
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});