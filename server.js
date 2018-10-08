let express = require('express');
// const mongoose = require('mongoose');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
users = [];
connections = [];


server.listen(process.env.PORT || 3000);

console.log("Server running");
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);

    //Disconnect
    socket.on('disconnect', (data) => {
        users.splice(users.indexOf(socket.username), 1);
        connections.splice(connections.indexOf(socket), 1);
        updateUsers()
        console.log("Connected: %s sockets connected", connections.length);
    })

    socket.on('close chat', (data) => {
        users = [];
        updateUsers();
    })

    socket.on('send message', function(data) {
        console.log(socket.username);
        io.sockets.emit('new message', { msg: data, username: socket.username });
       
    })

    socket.on('send username', function(data) {
        socket.username = data;
        users.push(socket.username);
        updateUsers();
    })

    socket.on('typing', (data) => {

        socket.broadcast.emit('typing', data);

    })

    socket.on('notTyping', (data) => {

        socket.broadcast.emit('notTyping', data);

    })

    function updateUsers() {


        io.sockets.emit('get user', undefined);

        io.sockets.emit('get user', users);

    }
})