const request = require("supertest");
const { app, server, io } = require("../server.js");
const ioClient = require("socket.io-client");

afterAll(() => {
  server.close();
});

describe("Backend server", () => {
  test("GET / returnerar index.html", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("StudyNest");
  });

  test("Socket.IO skickar och tar emot meddelanden", (done) => {
    const clientSocket = ioClient("http://localhost:3000");

    clientSocket.on("connect", () => {
      clientSocket.emit("chat message", { user: "Alice", text: "Hej" });
    });

    clientSocket.on("chat message", (msg) => {
      expect(msg).toEqual({ user: "Alice", text: "Hej" });
      clientSocket.disconnect();
      done();
    });
  });
});