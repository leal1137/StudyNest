const socket = io();

//Nytt
const warningBanner = document.getElementById('connection-warning');
let isPlanned = false; // Håller koll på om det är Ctrl+C eller ett fel

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

socket.on('disconnect', (reason) => {
    if (!isPlanned) {
        warningBanner.style.display = 'block';
    }
});

socket.on('connect', () => {
    warningBanner.style.display = 'none';
    isPlanned = false;
});