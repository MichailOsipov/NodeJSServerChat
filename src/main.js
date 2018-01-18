const server = require('http').createServer();
const io = require('socket.io')(server);
const {RoomManager} = require('./room-manager');
const {SocketManager} = require('./socket-manager');

const hostname = '127.0.0.1';
const port = 8088;

const roomManager = new RoomManager();


io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    const socketManager = new SocketManager(socket, io, roomManager);
    socketManager.subscribe();
});

server.listen(port, hostname, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    return console.log(`Server running at http://${hostname}:${port}/`);
});
