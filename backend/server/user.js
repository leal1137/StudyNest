class User {
    constructor(username,email,socketId) {
        this.username = username;
        this.email = email;
        this.socketId = socketId; //finns inte i databasen
    }
    getUsername() {
        return this.username;
    }
}
module.exports = User;