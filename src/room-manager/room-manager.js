const {filter, find, reject} = require('lodash');
const {generateUniqueId} = require('../utils/generate-unique-id');
const {MAIN_ROOM_NAME, MAIN_ROOM_ID} = require('./constants');


class RoomManager {
    constructor() {
        this.rooms = [{
            roomId: MAIN_ROOM_ID,
            roomName: MAIN_ROOM_NAME
        }];
        this.users = [];
    }

    createRoom({roomName}) {
        const roomId = generateUniqueId();
        this.rooms.push({
            roomName,
            roomId
        });
        return roomId;
    }

    removeRoomIfEmpty({roomId}) {
        if (roomId === MAIN_ROOM_ID) {
            return;
        }

        const users = filter(this.users, {roomId});
        if (users.length) {
            return;
        }
        this.rooms = reject(this.rooms, {roomId});
    }

    createUser({userId, nickname}) {
        this.users.push({userId, nickname, roomId: MAIN_ROOM_ID});
    }

    updateUser({userId, nickname}) {
        const user = find(this.users, {userId});
        if (user) {
            user.nickname = nickname;
        }
    }

    removeUser({userId}) {
        const user = find(this.users, {userId});
        user.roomId = '';
        this.removeRoomIfEmpty({roomId: user.roomId});
    }

    moveUserToRoom({roomId, userId}) {
        const user = find(this.users, {userId});
        const oldRoomId = user.roomId;
        if (user) {
            user.roomId = roomId;
        }
        this.removeRoomIfEmpty({roomId: oldRoomId});
    }
}

module.exports.RoomManager = RoomManager;
