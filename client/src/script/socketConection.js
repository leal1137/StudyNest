import { io } from "socket.io-client";

let socket = null;

/**
 * Skapar en anslutning till Socket.IO-servern med hjälp av en JWT-token som autentisering.
 * @function connect
 * @returns {socket}
 * @description Denna funktion hämtar JWT-token från localStorage och, 
 * om den finns och ingen befintlig socket-anslutning finns, skapar en ny Socket.IO-anslutning till servern. 
 * Token skickas som autentisering i anslutningsförfrågan.
 */
export function connect(){
    const token = localStorage.getItem('token');
    if (!token) return null;
    if (!socket) {
        socket = io("/", {path: "/socket.io", auth: {token: token}});
    }
    socket.auth = { token };
    if (!socket.connected) {
        socket.connect();
    }

    return socket;
}

/**
 * Loggar ut användaren genom att ta bort JWT-token från localStorage och koppla bort Socket.IO-anslutningen.
 * @function logoutDisconnect
 * @returns {void}
 * @description Denna funktion tar bort JWT-token från localStorage, 
 * kopplar bort Socket.IO-anslutningen och sätter både token och socket till undefined. 
 * Detta säkerställer att användaren är helt utloggad och att ingen anslutning till servern kvarstår.
 */
export function logoutDisconnect(activeSocket = socket) {
    if (activeSocket) {
        activeSocket.disconnect();
    }

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    socket = null;
    console.log("User Logged out, socket disconnected");
    
}
