const {reject} = require('lodash');

class Room {
    // ООП повеяло
    /**
     * Если присмотреться, этот класс - просто alias для List/Array
     * К тому же, использование подразумевает переход в обычный объект asObject
     * Хз хз)
     */
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
        this.users = reject(this.users, {name: userToRemove.name});
    }

     // Это класс, поэтому имена методов в контексте имени класса надо рассматривать
    asObject() {
        return ({
            name: this.name,
            users: this.users
        });
    }
}

module.exports.Room = Room;
