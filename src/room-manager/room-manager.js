const {filter, find, map} = require('lodash');

const {Room} = require('./room');

const MAIN_ROOM_NAME = 'main';

class RoomManager {
    constructor() {
        this.rooms = [new Room({roomName: MAIN_ROOM_NAME})];
    }

    addRoom({roomName}) {
        this.rooms.push(new Room({roomName}));
    }

    removeRoom({roomName}) {
        this.rooms = filter(this.rooms, room => room.name !== roomName);
    }

    getRoomByName({roomName}) {
        return find(this.rooms, room => room.name === roomName);
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

    getRoomsAsObject() {
        return map(this.rooms, room => room.getRoomAsObject());
    }
}

module.exports.RoomManager = RoomManager;
