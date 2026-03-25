const {sendMessage, ConnectChat} = require=("../client/script.js");

//describe("Frontend funktioner", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="input" value="Hej">
      <ul id="messages"></ul>
      <button id="connectbutton"></button>
      <div id="chat"></div>
    `;
    window.socket = { emit: jest.fn() };
  });

  test("sendMessage skickar meddelande med user och text", () => {
    window.username = "TestUser";
    sendMessage();
    expect(window.socket.emit).toHaveBeenCalledWith("chat message", {
      user: "TestUser",
      text: "Hej"
    });
  });

  test("ConnectChat togglar chatActive", () => {
    window.chatActive = false;
    ConnectChat();
    expect(window.chatActive).toBe(true);
    ConnectChat();
    expect(window.chatActive).toBe(false);
  });
//});