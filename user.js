class User {
    constructor(username,email,databaseId,socketId) {
        this.username = username;
        this.email = email;
        this.databaseId = databaseId;
        this.socketId = socketId; //finns inte i databasen
    }
    getUsername() {
        return this.username;
    }
}
module.exports = User;