const express = require('express');
const router = express.Router();
const { List_of_rooms } = require('./virtualRoom');

let rooms = [
    { id: 1, name: "Winter Wonderland", subject: "Economics", size: 50, x: 200.8594, y: 100.6200, inRoom: 0, chatEnabled: true, voiceEnabled: true, whiteboardEnabled: true },
    { id: 2, name: "Sunny Beach", subject: "Math", size: 50, x: 900.8397, y: 200.6468, inRoom: 0, chatEnabled: true, voiceEnabled: true, whiteboardEnabled: true },
    { id: 3, name: "Tilted Towers", subject: "Everything", size: 50, x: 370.8550, y: 385.6310, inRoom: 0, chatEnabled: true, voiceEnabled: true, whiteboardEnabled: true }
];

let nextId = 4;

function publicRoom(room) {
    const { password, ...roomWithoutPassword } = room;
    return roomWithoutPassword;
}

router.get('/', (req, res) => {
    const updatedRooms = rooms.map(room => {
        const participants = List_of_rooms[room.name];

        return {
            ...publicRoom(room),
            inRoom: participants ? participants.length : 0
        };
    });

    res.json(updatedRooms);
});

router.post('/', (req, res) => {
    const {
        name,
        size,
        x,
        y,
        isPrivate,
        password,
        chatEnabled = true,
        voiceEnabled = true,
        whiteboardEnabled = true
    } = req.body;
    const roomIsPrivate = Boolean(isPrivate);
    const roomPassword = typeof password === 'string' ? password.trim() : '';

    if (roomIsPrivate && !roomPassword) {
        return res.status(400).json({ error: 'Private rooms require a password' });
    }

    const newRoom = {
        id: nextId++,
        name: name,
        subject: "Misc",
        size: size || 15,
        x: x,
        y: y,
        inRoom: 0,
        isPrivate: roomIsPrivate,
        password: roomIsPrivate ? roomPassword : "",
        chatEnabled: Boolean(chatEnabled),
        voiceEnabled: Boolean(voiceEnabled),
        whiteboardEnabled: Boolean(whiteboardEnabled)
    };

    rooms.push(newRoom);
    res.status(201).json(publicRoom(newRoom));
});

router.post('/:id/verify-password', (req, res) => {
    const room = rooms.find(room => room.id === Number(req.params.id));

    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.isPrivate) {
        return res.json({ valid: true });
    }

    res.json({ valid: req.body.password === room.password });
});

module.exports = router;
