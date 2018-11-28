// Import necessary libraries
const path      = require('path');
const http      = require('http');
const express   = require('express');
const socketIO  = require('socket.io');

// Include local libraries
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

// Setup directory path variable
const publicPath = path.join(__dirname, '../public');

// Setup server variables
const port    = process.env.PORT || 3000;
const app     = express();
const server  = http.createServer(app);
const io      = socketIO(server);

// Setup the public path directory for serving the frontend website
app.use(express.static(publicPath));

// Variables
let users = new Users();

// Start SocketIO

io.on('connection', (socket) => {

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are required.');
    } else {
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);

      socket.join(params.room);

      socket.emit('newMessage', generateMessage(params.room, `Welcome to the chat room, ${params.name}!`));

      socket.broadcast.to(params.room).emit('newMessage', generateMessage(params.room, `${params.name} has joined the chat.`));

      console.log(`${params.name} has joined the chat room ${params.room}.`)

      io.to(params.room).emit('updateUserList', users.getUserList(params.room));

      callback();
    }
  });

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

    callback();
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    socket.broadcast.emit('newMessage', generateMessage(user.room, `${user.name} has left the chat.`));

    io.to(user.room).emit('updateUserList', users.getUserList(user.room));

    console.log(`${user.name} has left the chat.`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
