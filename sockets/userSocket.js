const io = require('../socket').getIO();

io.use((socket, next) => {
    console.log('inside middleware');
    if (socket.handshake.qeury && socket.handshake.qeury.token) {
        console.log('inside if')
        console.log(socket.handshake.qeury.token);
    }else {
        console.log('else')
        next(new Error('not authenticated.'));
    }
});

io.on('connection', (socket) => {
    console.log('new user connected');
});



module.exports = io;