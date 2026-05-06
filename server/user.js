class User {
    constructor(userId, username, email, socketId) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.socketId = socketId; //finns inte i databasen
        this.status = 'studying';
    }
    getUsername() {
        return this.username;
    }
}
module.exports = User;