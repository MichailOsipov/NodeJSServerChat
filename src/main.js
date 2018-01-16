const server = require('http').createServer();
const io = require('socket.io')(server);

const hostname = '127.0.0.1';
const port = 8088;

io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);
    let userNickname = '';
    socket.on('set nickname', ({nickname}) => {
        userNickname = nickname;
    });
    socket.on('send message', ({text}) => {
        io.sockets.emit('broadcast message', {author: userNickname, text});
    });
});

server.listen(port, hostname, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    return console.log(`Server running at http://${hostname}:${port}/`);
});
