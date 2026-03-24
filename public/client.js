// 1. Initialize the Socket.IO connection
const socket = io();

// 2. Grab the HTML elements
const form = document.getElementById('chatForm');
const input = document.getElementById('chatInput');
const messages = document.getElementById('messages');

// 3. Send a message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop the page from reloading
    
    if (input.value) {
        // Send the text to the server using the 'chat message' event
        socket.emit('chat message', input.value);
        input.value = ''; // Clear the input box
    }
});

// 4. Receive messages from the server
socket.on('chat message', (msg) => {
    // Create a new bullet point
    const item = document.createElement('li');
    item.textContent = msg;
    
    // Add it to the chat box
    messages.appendChild(item);
    
    // Auto-scroll to the bottom of the chat
    messages.scrollTop = messages.scrollHeight;
});