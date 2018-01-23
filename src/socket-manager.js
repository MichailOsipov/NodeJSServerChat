const {MAIN_ROOM_NAME} = require('./room-manager');

let usersCount = 0;

// Название как бы намекает, что здесь много всего. Это какой то аггрегирующий контроллер д.б.
class SocketManager {
    constructor(socket, io, roomManager) {
        this.socket = socket;
        this.io = io;
        this.roomManager = roomManager;
        this.roomName = MAIN_ROOM_NAME;
        this.socket.join(this.roomName);
        this.user = {name: ''}; // Работа с пользователем - это отдельный модуль
        roomManager.addUserToRoom({
            roomName: this.roomName,
            user: this.user
        });
    }

    /**
     * @private
     */
    sendNickname() {
        const {socket, user} = this;
        socket.emit('set a nickname', {nickname: user.name});
    }

    /**
     * @private
     */
    broadcastRoomScheme() {
        const {io, roomManager} = this;
        io.sockets.emit('set a room scheme', {roomScheme: roomManager.getRoomsAsObject()});
    }

    /**
     * @private
     */
    changeSocketRoom(prevRoom, nextRoom) {
        const {socket} = this;
        socket.leave(prevRoom);
        socket.join(nextRoom);
    }

    subscribe() {
        this.socket.on('ask a nickname', this.sendUniqueNickname.bind(this));
        this.socket.on('set a nickname', this.setNickname.bind(this));
        this.socket.on('send message', this.sendMessage.bind(this));
        this.socket.on('create room', this.createRoom.bind(this));
        this.socket.on('change room', this.changeRoom.bind(this));
        this.socket.on('disconnect', this.disconnect.bind(this));
    }

    sendUniqueNickname() {
        // Работа с пользователем - это отдельный модуль
        this.user.name = `user-${usersCount}`;
        usersCount += 1;
        this.sendNickname();
        this.broadcastRoomScheme();
    }

    setNickname({nickname}) {
        // Работа с пользователем - это отдельный модуль
        this.user.name = nickname;
        this.sendNickname();
        this.broadcastRoomScheme(); // Повторяется в нескольких местах - требуется HOF или декоратор
    }

    sendMessage({text}) {
        const {io, roomName, user} = this;
        io.to(roomName).emit('broadcast message', {author: user.name, text});
    }

    createRoom({roomName: newRoomName}) {
        const {roomManager, roomName, user} = this;
        roomManager.addRoom({roomName: newRoomName});
        roomManager.moveUserFromOneRoomToAnother({
            prevRoom: roomName,
            currRoom: newRoomName,
            user
        });
        this.changeSocketRoom(roomName, newRoomName); // 82 и 83 Всегда идут вместе
        this.roomName = newRoomName;
        this.broadcastRoomScheme(); // Повторяется в нескольких местах - требуется HOF или декоратор
    }

    changeRoom({roomName: newRoomName}) {
        if (this.roomName === newRoomName) { // Пахнет HOF)
            return;
        }
        const {roomManager, roomName, user} = this;
        roomManager.moveUserFromOneRoomToAnother({
            prevRoom: roomName,
            currRoom: newRoomName,
            user
        });
        this.changeSocketRoom(roomName, newRoomName); // 97 и 98 Всегда идут вместе
        this.roomName = newRoomName;
        this.broadcastRoomScheme(); // Повторяется в нескольких местах - требуется HOF или декоратор
    }

    disconnect() {
        const {roomManager, roomName, user} = this;
        roomManager.removeUserFromRoom({roomName, user});
        this.broadcastRoomScheme(); // Повторяется в нескольких местах - требуется HOF или декоратор
    }
}

module.exports.SocketManager = SocketManager;
