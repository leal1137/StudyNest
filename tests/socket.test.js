// tests/socket.test.js
const request = require('supertest');
const Client = require('socket.io-client');
const { app, server } = require('../server'); 

// Vi mockar databasen för att undvika "ECONNREFUSED" under testningen
jest.mock('../db/pool', () => {
    return {
        query: jest.fn().mockResolvedValue({ rows: [] }),
        end: jest.fn().mockResolvedValue(true)
    };
});

describe('Full Integration: Signup, Login & Socket Chat', () => {
  let clientSocket;
  let validToken;
  let port;

  // Unik testmejl för att undvika problem om testet körs flera gånger
  // Måste vara en godkänd domän enligt din auth.js
  const testEmail = `test_${Date.now()}@student.uu.se`; 
  const testUser = 'TestAnvändare';
  const testPass = 'hemligt123';

  beforeAll((done) => {
    // Starta den riktiga servern på en slumpmässig, ledig port
    server.listen(0, () => {
      port = server.address().port;
      done();
    });
  });

  afterAll((done) => {
    // Stäng ner anslutningar och stäng servern efter testerna
    if (clientSocket) {
      clientSocket.close();
    }
    server.close(done);
  });

  test('1. HTTP POST /auth/signup - Ska kunna registrera en student', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({
        email: testEmail,
        username: testUser,
        password: testPass
      });
    
    // Vi förväntar oss antingen 200 (Skapad) eller 409 (Finns redan)
    expect([200, 409]).toContain(response.status);
  });

  test('2. HTTP POST /auth/login - Ska logga in och ge tillbaka en JWT-token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: testEmail,
        password: testPass
      });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined(); // Säkerställ att vi fick en token
    
    // Spara tokenen för att använda i socket-testerna!
    validToken = response.body.token; 
  });

  test('3. SOCKET - Dörrvakten ska neka anslutning om token saknas', (done) => {
    // Försöker ansluta utan att skicka med vår token
    const noAuthClient = new Client(`http://localhost:${port}`);
    
    noAuthClient.on('connect_error', (err) => {
      expect(err.message).toBe('No token'); // Dörrvakten gör sitt jobb!
      noAuthClient.close();
      done();
    });
  });

  test('4. SOCKET - Ska tillåta anslutning med giltig token och registrera "login"', (done) => {
    // Försöker ansluta och skickar med tokenen vi fick i Test 2
    clientSocket = new Client(`http://localhost:${port}`, {
      auth: { token: validToken }
    });

    clientSocket.on('connect', () => {
      expect(clientSocket.id).toBeDefined(); // Vi kom in och fick ett Socket ID!

      // Testa din specifika "login"-händelse från server.js
      clientSocket.emit('login', testUser);
      
      // I det här skedet är vi anslutna. Vi avslutar testet.
      done();
    });
  });
  
});