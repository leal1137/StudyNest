// tests/socket.test.js
const request = require('supertest');
const { app, server } = require('../server'); 
const pool = require('../db/pool');

describe('Sign Up & Login Tests', () => {
  const validUser = {
      email: `testUser_${Date.now()}@student.uu.se`,
      username: `StudentEtt_${Date.now()}`,
      password: 'password123'
  };

  const invalidUser = {
      email: `hacker_${Date.now()}@gmail.com`,
      username: `Hacker_${Date.now()}`,
      password: 'password123'
  };

  afterAll(async () => {
    //Clean up the test users from the DB
    try {
        await pool.query("DELETE FROM users WHERE email LIKE 'testUser_%@student.uu.se'");
        
    } catch (error) {
        console.error('Could not clean up test user:', error.message);
    }

    // Close the database connection and the server
    await pool.end();
    server.close();
  });

  test('1. En användare signar upp med giltig email', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(validUser);
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User created');

    const dbResult = await pool.query('SELECT * FROM users WHERE email = $1', [validUser.email]);
    expect(dbResult.rows.length).toBe(1);
    expect(dbResult.rows[0].email).toBe(validUser.email);
    expect(dbResult.rows[0].username).toBe(validUser.username);
  });

  test('2. En användare signar upp med ogiltig email', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(invalidUser);
    
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Only students allowed');
    const dbResult = await pool.query('SELECT * FROM users WHERE email = $1', [invalidUser.email]);
    expect(dbResult.rows.length).toBe(0);
  });

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

  test('4. En användare försöker logga in med fel lösenord', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: validUser.email,
        password: 'fel_losenord_123'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Wrong password');
  });

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

  test('6. En användare försöker signa upp med en mail som redan är registrerad', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(validUser);
    
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Username or email already exists');
  });

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

  test('8. En användare skickar in tomma fält vid registrering', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ email: '', username: '', password: '' });
    
    expect(response.status).not.toBe(200);
  });

  test('9. En användare skickar in tomma fält vid inloggning', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: '', password: '' });

    expect(response.status).not.toBe(200);
  });

  test('10. Väldigt många användare signar up på en gång', async () => {
    const dbResultPrior = await pool.query('SELECT count(*) FROM users');
    const totalUsersPrior = parseInt(dbResultPrior.rows[0].count);
    testUser = {};
    for (let i = 0; i < 20; i++) {
      testUser = {
        email: `testUser_${Date.now()}'@student.uu.se`,
        username: `TestUser_${Date.now()}`,
        password: 'password123'
      };

      const response = await request(app)
      .post('/auth/signup')
      .send(testUser);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User created');
    }

    const dbResult = await pool.query('SELECT count(*) FROM users');
    const totalUsers = parseInt(dbResult.rows[0].count);
    expect(totalUsers - totalUsersPrior).toBe(20);

  });
});