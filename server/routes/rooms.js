const express = require('express');
const router = express.Router();
const { List_of_rooms } = require('./virtualRoom');

let rooms = [
    { id: 1, name: "Ekonomikum", subject: "Economics", size: 50, x: 200.8594, y: 700.6200, inRoom: 0, isPrivate: false, password: "" },
    { id: 2, name: "Ångström", subject: "Math", size: 50, x: 500.8397, y: 200.6468, inRoom: 0, isPrivate: false, password: "" },
    { id: 3, name: "Carolina Rediviva", subject: "English", size: 50, x: 600.8550, y: 700.6310, inRoom: 0, isPrivate: false, password: "" }
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
    const { name, max_capacity, x, y, isPrivate, is_private, password } = req.body;
    const roomIsPrivate = Boolean(isPrivate || is_private);
    const roomPassword = typeof password === 'string' ? password.trim() : '';

    if (roomIsPrivate && !roomPassword) {
        return res.status(400).json({ error: 'Private rooms require a password' });
    }

    const newRoom = {
        id: nextId++,
        name: name,
        subject: "Misc",
        size: max_capacity || 15,
        x: x,
        y: y,
        inRoom: 0,
        isPrivate: roomIsPrivate,
        password: roomIsPrivate ? roomPassword : ""
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
