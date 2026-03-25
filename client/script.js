let socket;
let chatActive = false;

const messages = document.getElementById("messages");

function ConnectChat(){
    if (chatActive) {
        disconnectServer();
    }else {
        connectServer();
    }
}

function connectServer() {
    socket = io();

    socket.on("connect", () => {
        console.log("Ansluten till servern:", socket.id);
    });

    socket.on("chat message", (msg) => {
        const item = document.createElement("li");
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    document.getElementById("connectbutton").innerText = "Disconnect";
    document.getElementById("chat").style.display = "block";

    chatActive = true;
}

function disconnectServer() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }

    document.getElementById("connectbutton").innerText = "Connect";
    document.getElementById("chat").style.display = "none";
    
    chatActive = false;
}

function sendMessage() {
    const input = document.getElementById("input");

    if (input.value && socket) {
        socket.emit("chat message", input.value);
        input.value = "";
    }
}