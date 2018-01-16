const server = require('http').createServer();
const io = require('socket.io')(server);
const {RoomManager, MAIN_ROOM_NAME} = require('./room-manager');

const hostname = '127.0.0.1';
const port = 8088;

let usersCount = 0;
const roomManager = new RoomManager();


io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);
    const user = {name: ''};
    let roomName = MAIN_ROOM_NAME;
    roomManager.addUserToRoom({
        roomName,
        user
    });

    socket.join(roomName);
    socket.on('ask a nickname', () => {
        user.name = `user-${usersCount}`;
        usersCount += 1;
        socket.emit('set a nickname', {nickname: user.name});
        io.sockets.emit('set a room scheme', {roomScheme: roomManager.getRoomsAsObject()});
    });

    socket.on('set a nickname', ({nickname}) => {
        user.name = nickname;
        socket.emit('set a nickname', {nickname: user.name});
        io.sockets.emit('set a room scheme', {roomScheme: roomManager.getRoomsAsObject()});
    });

    socket.on('send message', ({text}) => {
        io.to(roomName).emit('broadcast message', {author: user.name, text});
    });

    socket.on('create room', ({roomName: newRoomName}) => {
        roomManager.addRoom({roomName: newRoomName});
        roomManager.moveUserFromOneRoomToAnother({
            prevRoom: roomName,
            currRoom: newRoomName,
            user
        });
        roomName = newRoomName;
        socket.join(roomName);
        io.sockets.emit('set a room scheme', {roomScheme: roomManager.getRoomsAsObject()});
    });

    socket.on('change room', ({roomName: newRoomName}) => {
        roomManager.moveUserFromOneRoomToAnother({
            prevRoom: roomName,
            currRoom: newRoomName,
            user
        });
        roomName = newRoomName;
        socket.join(roomName);
        io.sockets.emit('set a room scheme', {roomScheme: roomManager.getRoomsAsObject()});
    });

    socket.on('disconnect', () => {
        roomManager.removeUserFromRoom({roomName, user});
    });
});

server.listen(port, hostname, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    return console.log(`Server running at http://${hostname}:${port}/`);
});
