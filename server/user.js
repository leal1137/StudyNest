class User {
    constructor(userId, username, email, socketId, avatar = '0.svg') {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.socketId = socketId; //finns inte i databasen
        this.avatar = avatar;
        this.status = 'studying';
    }
    getUsername() {
        return this.username;
    }
}
module.exports = User;
