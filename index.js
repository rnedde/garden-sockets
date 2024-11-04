//Require express
let express = require('express');
let app = express();
//Serve static pages
app.use('/', express.static('public'));

//Start http server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Start socket server
let io = require('socket.io');
io = new io.Server(server);

// Store user flower data
let users = {};

//Establish socket connection
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    socket.on('userData', function(data) {       
        // Add socket id to user data
        data.id = socket.id;

        // Store or update user flower data
        users[socket.id] = {
            name: data.name,
            xPos: data.xPos,
            height: data.height,
            color: data.color,
            petalSize: data.petalSize,
            petalCount: data.petalCount,
            id: socket.id
        };

        // Broadcast updated user data to all clients
        io.sockets.emit('userData', users[socket.id]);
    });

    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);

        // Remove user from users object
        delete users[socket.id];

        // Notify other clients about the disconnection
        io.sockets.emit('userDisconnected', socket.id);
    });

    // Send existing users data to newly connected client
    for (let userId in users) {
        socket.emit('userData', users[userId]);
    }
});
