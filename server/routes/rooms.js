const express = require('express');
const router = express.Router();
const { List_of_rooms } = require('./virtualRoom');

// Din array sparad i serverns minne
let rooms = [
    { id: 1, name: "Ekonomikum", subject: "Economics", size: 50, x: 200.8594, y: 700.6200, inRoom: 0 },
    { id: 2, name: "Ångström", subject: "Math", size: 50, x: 500.8397, y: 200.6468, inRoom: 0 },
    { id: 3, name: "Carolina Rediviva", subject: "English", size: 50, x: 600.8550, y: 700.6310, inRoom: 0 }
];

let nextId = 4;

// GET /api/rooms - Uppdaterar antalet användare och skickar till frontenden
router.get('/', (req, res) => {
    const updatedRooms = rooms.map(room => {
        // Kolla hur många som är i rummet via Socket.IO
        const participants = List_of_rooms[room.name];
        
        return {
            ...room, // Kopierar över id, name, subject, x, y etc.
            // Om listan finns, sätt antalet deltagare, annars 0
            inRoom: participants ? participants.length : 0 
        };
    });

    res.json(updatedRooms);
});

// POST /api/rooms - Lägger till ett nytt rum i arrayen
router.post('/', (req, res) => {
    const { name, max_capacity, x, y } = req.body;

    const newRoom = {
        id: nextId++,
        name: name,
        subject: "Misc", 
        size: max_capacity || 15,
        x: x,
        y: y,
        inRoom: 0
    };

    rooms.push(newRoom);
    res.status(201).json(newRoom);
});

module.exports = router;