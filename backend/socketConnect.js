const socketio = require("socket.io");
const botDialogflow = require('./bot');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');


exports.socketConnect = (server) =>{

    const io = socketio(server);

    io.on('connect', (socket) => {
        socket.on('join', async ({ name, room, bot }, callback) => {

            const { error, user } = addUser({ id: socket.id, name, room });

            if(bot === 'true'){
                const response = await botDialogflow.sendBot('Oi', room);            
                socket.emit('message', { user: 'Bot', text: response });
            } else {
                
            if(error) return callback(error);
        
            socket.join(user.room);
        
            socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
            socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
        
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        
            callback();
            }
        });

        socket.on('sendMessage', async (message) => {
                const user = getUser(socket.id);
                io.to(user.room).emit('message', {user: user.name, text: message});
                io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});
            
        })

        socket.on('sendMessageBot', async (message, room) => {
            const user = getUser(socket.id);
            const response = await botDialogflow.sendBot(message, room);
            io.emit('message', { user: 'Bot', text:response});
        })

        socket.on('disconnect', () => {
            const user = removeUser(socket.id);
            
            if(user){
                io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left`});
            }
        })
        
    })
}