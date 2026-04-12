// socket.test.js
const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

describe('Socket.io Chat', () => {
  let io, serverSocket, clientSocket;

  // Before the tests run, set up a mini-server
  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    
    // Start listening on a random, free port
    httpServer.listen(() => {
      const port = httpServer.address().port;
      
      // Connect the fake client to that port
      clientSocket = new Client(`http://localhost:${port}`);
      
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      
      clientSocket.on('connect', done);
    });
  });

  // After tests are done, clean up and close connections
  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('should receive a message sent from the server', (done) => {
    // 1. Tell the client to listen for 'receive_message'
    clientSocket.on('receive_message', (arg) => {
      expect(arg).toBe('Hello World');
      done(); // Tell Jest the test is finished
    });

    // 2. Make the server emit the message
    serverSocket.emit('receive_message', 'Hello World');
  });
});