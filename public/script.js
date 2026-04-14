//script.js
// --- 1. KONTROLLERA INLOGGNING DIREKT ---
const token = localStorage.getItem('token');

// Om ingen token finns, skicka användaren till inloggningssidan direkt
if (!token) {
    window.location.href = '/login.html'; 
}

// --- 2. STARTA SOCKET-ANSLUTNING MED TOKEN ---
const socket = io({
    auth: {
      token: token
    }
});


// --- 3. UI-FUNKTIONER ---
function joinRoom() {
    const room = document.getElementById('room').value;
    if (room) {
        socket.emit('join_room', room);
        document.getElementById('room').value = ""; // Töm fältet
    }
}

function sendMessage() {
    const message = document.getElementById('message').value;
    if (message) {
        socket.emit('send_message', message);
        document.getElementById('message').value = ""; // Töm fältet
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}


// --- 4. LYSSNA PÅ HÄNDELSER FRÅN CHATTEN ---
socket.on('receive_message', (data) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><b>${data.username}:</b> ${data.message}</p>`;
});

socket.on('user_joined', (username) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><i>${username} joined</i></p>`;
});

socket.on('joined_room', (data) => {
    const chat = document.getElementById('chat');
    // Hanterar om servern skickar antingen { room: "namn" } eller bara "namn"
    const roomName = data.room || data; 
    chat.innerHTML += `<p><b>You joined room ${roomName}</b></p>`;
});

socket.on('user_left', (username) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><i>${username} left</i></p>`;
});


// --- 5. HANTERA FRÅNKOPPLING OCH FEL ---
const warningBanner = document.getElementById('connection-warning');
let isPlanned = false; // Håller koll på om det är Ctrl+C eller ett fel

// Om servern stänger ner planerat
socket.on('server_shutdown', (meddelande) => {
    isPlanned = true;
    document.body.style.margin = '0';
    document.body.innerHTML = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center; font-family: sans-serif; background-color: #f4f4f4;">
            <div style="font-size: 70px; margin-bottom: 20px;">😥</div>
            <h1 style="color: #333;">${meddelande}</h1>
        </div>
    `;
});

// Om anslutningen bryts oväntat
socket.on('disconnect', (reason) => {
    if (!isPlanned && warningBanner) {
        warningBanner.style.display = 'block';
    }
});

// Om vi lyckas ansluta igen
socket.on('connect', () => {
    if (warningBanner) {
        warningBanner.style.display = 'none';
    }
    isPlanned = false;
});

// Om token är felaktig eller har gått ut
socket.on('connect_error', (err) => {
    if (err.message === "Invalid token" || err.message === "No token") {
        alert("Din inloggning har gått ut eller är ogiltig. Logga in igen.");
        logout();
    }
});