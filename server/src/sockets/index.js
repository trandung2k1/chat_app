const { Server } = require('socket.io');
const socket = (app) => {
    const io = new Server(app, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        console.log(socket.id);
        socket.on('hello', (msg) => {
            console.log(msg);
        });
    });
};

module.exports = socket;
