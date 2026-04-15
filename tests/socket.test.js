// tests/socket.test.js
const request = require('supertest');
const { app, server } = require('../server'); 

// Tar bort database errorn. Ta bort när det är fixat
jest.mock('../db/pool', () => {
    return {
        query: jest.fn().mockResolvedValue({ rows: [] }),
        end: jest.fn().mockResolvedValue(true)
    };
});

describe('Sign Up & Login Tests', () => {
  const validUser = {
      email: `student_${Date.now()}@student.uu.se`,
      username: 'StudentEtt',
      password: 'password123'
  };

  const invalidUser = {
      email: `hacker_${Date.now()}@gmail.com`,
      username: 'Hacker',
      password: 'password123'
  };

  // --- TEST 1: Giltig signup ---
  test('1. En användare signar upp med giltig email', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(validUser);
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User created');
  });

  // --- TEST 2: Ogiltig signup ---
  test('2. En användare signar upp med ogiltig email', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(invalidUser);
    
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Only students allowed');
  });

  // --- TEST 3: Giltig inloggning ---
  test('3. En användare försöker logga in med ett giltigt email och lösenord', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: validUser.email,
        password: validUser.password
      });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  // --- TEST 4: Ogiltig inloggning ---
  test('4. En användare försöker logga in med ogiltigt email och lösenord', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: validUser.email,
        password: 'fel_losenord_123'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Wrong password');
  });

  // --- TEST 5: Flera inloggningar på samma konto ---
  test('5. Två användare loggar in med samma email och lösenord', async () => {
    const login1 = await request(app)
      .post('/auth/login')
      .send({
        email: validUser.email,
        password: validUser.password
      });

    const login2 = await request(app)
      .post('/auth/login')
      .send({
        email: validUser.email,
        password: validUser.password
      });

    // Båda inloggningarna lyckas
    expect(login1.status).toBe(200);
    expect(login2.status).toBe(200);
    
    expect(login1.body.token).toBeDefined();
    expect(login2.body.token).toBeDefined();
  });

  // --- TEST 6: Användare försöker signa upp med en mail som redan är registrerad ---
  test('6. En användare försöker signa upp med en mail som redan är registrerad', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(validUser);
    
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Username or email already exists');
  });

  // --- TEST 7: Användare försöker logga in med en mail som inte finns ---
  test('7. En användare försöker logga in med en mail som inte finns', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'finns_inte@student.uu.se',
        password: 'password123'
      });
    
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  // --- TEST 8: Användare skickar in tomma fält vid registrering ---
  test('8. En användare skickar in tomma fält vid registrering', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ email: '', username: '', password: '' });
    
    expect(response.status).not.toBe(200);
  });

});