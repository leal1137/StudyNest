import { io } from "socket.io-client";

let token = undefined;
export let socket = undefined;



export function connect(){
    token = localStorage.getItem('token');
    if (token && !socket) {
        socket = io("/", {path: "/socket.io", auth: {token: token}});
    }
}

export function logoutDisconnect() {
    if (socket) {
        socket.disconnect();
        socket = undefined;
        localStorage.removeItem('token');
        token = undefined;
        console.log("User Logged out, socket disconnected");
    }
}