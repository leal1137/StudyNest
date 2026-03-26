class User {
    constructor( username) {
        this.username = username;
        this.room = null;
    }
    getUsername() {
        return this.username;
    }
    getRoom() {
        return this.room;
    }
    
}
module.exports = User;