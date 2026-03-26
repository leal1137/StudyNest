const socket = io();

    function joinRoom() {
      const username = document.getElementById('username').value;
      const room = document.getElementById('room').value;
      socket.emit('join_room', { username, room });
    }

    function sendMessage() {
      const message = document.getElementById('message').value;
      socket.emit('send_message', message);
    }

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
      chat.innerHTML += `<p><b>You joined room ${data.room}</b></p>`;
    });

    socket.on('user_left', (username) => {
      const chat = document.getElementById('chat');
      chat.innerHTML += `<p><i>${username} left</i></p>`;
    });