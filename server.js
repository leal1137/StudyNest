// 1. Import the Express framework
const express = require('express');

// 2. Initialize the Express application
const app = express();

// 3. Define the port you want the server to listen on
const PORT = 3000;

// 4. Create a "Route"
// This tells the server what to do when a user visits the root URL ("/")
app.get('/', (req, res) => {
    res.send('Hello, World! This is my basic JavaScript server.');
});

// 5. Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}`);
});