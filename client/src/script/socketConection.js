import { io } from "socket.io-client";

let token = undefined;
let socket = undefined;

export function connect(){
    
    token = localStorage.getItem('token');
    console.log("Connecting to socket with token:", token);
    socket = io("/", {path: "/socket.io", auth: {token: token}});
}