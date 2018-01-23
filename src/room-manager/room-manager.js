const {reject, find, map} = require('lodash');

const {Room} = require('./room');

// Дубликат
const MAIN_ROOM_NAME = 'main';

/*
 * Да. Здесь в классе больше смысла.
 * А что если я тебе скажу, что комнат - нет, а есть только пользователи ;)
 * Хотя можно и так, конечно
 */
class RoomManager {
    constructor() {
        this.rooms = [new Room({roomName: MAIN_ROOM_NAME})];
    }

    addRoom({roomName}) {
        this.rooms.push(new Room({roomName}));
    }

    removeRoom({roomName}) {
        this.rooms = reject(this.rooms, {name: roomName});
    }

    getRoomByName({roomName}) {
        return find(this.rooms, {name: roomName});
    }

    addUserToRoom({roomName, user}) {
        const currRoom = this.getRoomByName({roomName});
        if (currRoom) {
            currRoom.addUser({user});
        }
    }

    removeUserFromRoom({roomName, user}) {
        const currRoom = this.getRoomByName({roomName});
        if (currRoom) {
            currRoom.removeUser({user});
            if (roomName !== MAIN_ROOM_NAME && currRoom.isEmpty()) {
                this.removeRoom({roomName});
            }
        }
    }

    moveUserFromOneRoomToAnother({prevRoom, currRoom, user}) {
        this.removeUserFromRoom({roomName: prevRoom, user});
        this.addUserToRoom({roomName: currRoom, user});
    }

    asObject() {
        return map(this.rooms, room => room.asObject());
    }
}

module.exports.RoomManager = RoomManager;
