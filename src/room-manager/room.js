const {filter} = require('lodash');

class Room {
    constructor({roomName}) {
        this.name = roomName;
        this.users = [];
    }

    isEmpty() {
        return this.users.length === 0;
    }

    addUser({user}) {
        this.users.push(user);
    }

    removeUser({user: userToRemove}) {
        this.users = filter(this.users, user => user.name !== userToRemove.name);
    }

    getRoomAsObject() {
        return ({
            name: this.name,
            users: this.users
        });
    }
}

module.exports.Room = Room;
