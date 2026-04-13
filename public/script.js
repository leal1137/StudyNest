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

/**
 * Hanterar användarens begäran att gå med i ett chattrum. 
 * Funktionen hämtar rumsnamnet från webbsidans inmatningsfält och 
 * skickar en förfrågan till servern via WebSockets. Om inmatningsfältet 
 * är tomt avbryts funktionen. Efter att signalen skickats rensas 
 * textfältet.
 */
function joinRoom() {
    const room = document.getElementById('room').value;
    if (room) {
        socket.emit('join_room', room);
        document.getElementById('room').value = ""; // Töm fältet
    }
}


/**
 * Hämtar texten från chattens inmatningsfält och skickar det till servern.
 * Om fältet är tomt skickas inget meddelande. Efter att meddelandet har 
 * skickats rensas inmatningsfältet automatiskt.
 */
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

/**
 * Lyssnar efter inkommande chattmeddelanden från servern och 
 * lägger till dem i chattfönstret med avsändarens namn i fetstil.
 *
 * @name onReceiveMessage
 * @function
 * @param {Object} data - Meddelandedata från servern.
 */
socket.on('receive_message', (data) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><b>${data.username}:</b> ${data.message}</p>`;
});


/**
 * Lyssnar efter information om att en ny användare har anslutit till 
 * rummet, och skriver ut ett i chatten.
 *
 * @name onUserJoined
 * @function
 * @param {string} username - Namnet på användaren som anslöt.
 */
socket.on('user_joined', (username) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><i>${username} joined</i></p>`;
});


/**
 * Tar emot en bekräftelse från servern på att klienten framgångsrikt 
 * har gått med i ett rum, och meddelar användaren detta i chattfönstret.
 *
 * @name onJoinedRoom
 * @function
 * @param {Object|string} data - Information om rummet (kan vara ett objekt eller en direkt sträng).
 */
socket.on('joined_room', (data) => {
    const chat = document.getElementById('chat');
    // Hanterar om servern skickar antingen { room: "namn" } eller bara "namn"
    const roomName = data.room || data; 
    chat.innerHTML += `<p><b>You joined room ${roomName}</b></p>`;
});


/**
 * Lyssnar efter information om att en användare har lämnat rummet 
 * och skriver ut ett kursivt meddelande i chatten.
 *
 * @name onUserLeft
 * @function
 * @param {string} username - Namnet på användaren som lämnade.
 */
socket.on('user_left', (username) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><i>${username} left</i></p>`;
});


// --- 5. HANTERA FRÅNKOPPLING OCH FEL ---
const warningBanner = document.getElementById('connection-warning');
let isPlanned = false; // Håller koll på om det är Ctrl+C eller ett fel

/**
 * Hanterar situationen när servern stängs ner planerat av administratör. 
 * Ersätter hela webbsidans innehåll med en vänlig fel-skärm för att 
 * tydligt visa att tjänsten är tillfälligt nere.
 *
 * @name onServerShutdown
 * @function
 * @param {string} meddelande - Anledningen eller meddelandet från servern.
 */
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

/**
 * Lyssnar efter oväntade frånkopplingar från servern (t.ex. nätverksproblem). 
 * Om frånkopplingen inte är planerad (som vid en server-shutdown), 
 * visas en varningsbanner för användaren.
 *
 * @name onDisconnect
 * @function
 * @param {string} reason - Systemets anledning till frånkopplingen.
 */
socket.on('disconnect', (reason) => {
    if (!isPlanned && warningBanner) {
        warningBanner.style.display = 'block';
    }
});

/**
 * Lyssnar efter en lyckad anslutning (eller återanslutning) till servern. 
 * Gömmer varningsbannern om den var synlig och nollställer statusen.
 *
 * @name onConnect
 * @function
 */
socket.on('connect', () => {
    if (warningBanner) {
        warningBanner.style.display = 'none';
    }
    isPlanned = false;
});

/**
 * Fångar upp anslutningsfel, specifikt gällande autentisering. 
 * Om servern nekar anslutningen på grund av en saknad eller ogiltig JWT-token, 
 * varnas användaren och skickas till inloggningssidan.
 *
 * @name onConnectError
 * @function
 * @param {Error} err - Felobjektet från servern.
 */
socket.on('connect_error', (err) => {
    if (err.message === "Invalid token" || err.message === "No token") {
        alert("Din inloggning har gått ut eller är ogiltig. Logga in igen.");
        logout();
    }
});