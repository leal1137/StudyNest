class User {
    constructor( username, room) {
        this.username = username;
        this.room = room;
    }
    getUsername() {
        return this.username;
    }
    getRoom() {
        return this.room;
    }
    
}
module.exports = User;