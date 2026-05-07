const express = require('express');
const router = express.Router();

// Din önskade array sparad i serverns minne
let rooms = [
    { id: 1, name: "Winter Wonderland", subject: "Economics", size: 50, x: 200.8594, y: 100.6200, inRoom: 0 },
    { id: 2, name: "Sunny Beach", subject: "Math", size: 50, x: 900.8397, y: 200.6468, inRoom: 0 },
    { id: 3, name: "Tilted Towers", subject: "Everything", size: 50, x: 370.8550, y: 385.6310, inRoom: 0 }
];

let nextId = 4;

// GET /api/rooms - Skickar arrayen till frontenden
router.get('/', (req, res) => {
    res.json(rooms);
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