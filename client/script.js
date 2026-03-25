let socket;
let username = "";
let chatActive = false;

const messages = document.getElementById("messages");

export function ConnectChat(){
    if (chatActive) {
        disconnectServer();
    }else {
        username = prompt("Username:");
        if (!username){
            alert("Username cannot be empty!");
            return;
        }
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
        item.textContent = `${msg.user}: ${msg.msg}`;
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

export function sendMessage() {
    const input = document.getElementById("input");

    if (input.value && socket) {
        const message = {user: username, msg:input.value};
        socket.emit("chat message", message);
        input.value = "";
    }
}