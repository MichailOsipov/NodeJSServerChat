const {generateUniqueId} = require('./utils/generate-unique-id');
const {MAIN_ROOM_ID} = require('./room-manager');

let usersCount = 0;

class SocketManager {
    constructor(socket, io, roomManager) {
        this.socket = socket;
        this.io = io;
        this.roomManager = roomManager;
        this.roomId = MAIN_ROOM_ID;
        this.socket.join(this.roomId);
        this.userId = generateUniqueId();
        roomManager.createUser({userId: this.userId, nickname: ''});
    }

    /**
    * @private
    */
    sendUserId() {
        const {socket, userId} = this;
        socket.emit('set a userId', {userId});
    }

    /**
    * @private
    */
    sendNickname({nickname}) {
        const {socket} = this;
        socket.emit('set a nickname', {nickname});
    }

    /**
    * @private
    */
    broadcastRoomScheme() {
        const {io, roomManager} = this;
        const {users, rooms, roomsUsers} = roomManager;
        io.sockets.emit('set a room scheme', {roomScheme: {rooms, users, roomsUsers}});
    }

    /**
    * @private
    */
    changeSocketRoom(nextRoomId) {
        const {socket, roomId} = this;
        socket.leave(roomId);
        socket.join(nextRoomId);
    }

    /**
    * @private
    */
    sendUniqueNickname() {
        const nickname = `user-${usersCount}`;
        usersCount += 1;
        this.roomManager.updateUser({userId: this.userId, nickname});
        this.sendNickname({nickname});
        this.broadcastRoomScheme();
    }

    /**
    * @private
    */
    setNickname({nickname}) {
        this.roomManager.updateUser({userId: this.userId, nickname});
        this.sendNickname({nickname});
        this.broadcastRoomScheme();
    }

    /**
    * @private
    */
    sendMessage({text}) {
        const {io, roomId, userId} = this;
        io.to(roomId).emit('broadcast message', {userId, text});
    }

    /**
    * @private
    */
    createRoom({roomName}) {
        const {roomManager, roomId, userId} = this;
        const newRoomId = roomManager.createRoom({roomName});
        roomManager.moveUserToRoom({
            roomId: newRoomId,
            userId
        });
        this.changeSocketRoom(roomId, newRoomId);
        this.broadcastRoomScheme();
    }

    /**
    * @private
    */
    changeRoom({roomId: newRoomId}) {
        const {roomManager, roomId, userId} = this;
        roomManager.moveUserToRoom({
            roomId: newRoomId,
            userId
        });
        this.changeSocketRoom(roomId, newRoomId);
        this.broadcastRoomScheme();
    }

    /**
    * @private
    */
    disconnect() {
        const {roomManager, userId} = this;
        roomManager.removeUser({userId});
        this.broadcastRoomScheme();
    }

    subscribe() {
        this.socket.on('ask a userId', this.sendUserId.bind(this));
        this.socket.on('ask a nickname', this.sendUniqueNickname.bind(this));
        this.socket.on('set a nickname', this.setNickname.bind(this));
        this.socket.on('send message', this.sendMessage.bind(this));
        this.socket.on('create room', this.createRoom.bind(this));
        this.socket.on('change room', this.changeRoom.bind(this));
        this.socket.on('disconnect', this.disconnect.bind(this));
    }
}

module.exports.SocketManager = SocketManager;
