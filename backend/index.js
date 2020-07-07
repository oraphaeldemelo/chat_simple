const express = require('express');
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const botDialogflow = require('./bot');


const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const io = socketio(server);

app.use(router); 


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

server.listen(PORT, () => {
    console.log(`Server está rodando na porta ${PORT}`);
    
}) 