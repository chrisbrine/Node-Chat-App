// Import necessary libraries
const path      = require('path');
const http      = require('http');
const express   = require('express');
const socketIO  = require('socket.io');

// Setup directory path variable
const publicPath = path.join(__dirname, '../public');

// Setup server variables
const port    = process.env.PORT || 3000;
const app     = express();
const server  = http.createServer(app);
const io      = socketIO(server);

// Setup the public path directory for serving the frontend website
app.use(express.static(publicPath));

// Start SocketIO

io.on('connection', (socket) => {

  socket.on('newUser', (user) => {
    socket.user = user;

    socket.emit('fromAdmin', {
      text: 'Welcome to chat!',
    });

    socket.broadcast.emit('fromAdmin', {
      text: `${user.name} has joined the chat.`,
    });

    console.log(`${user.name} has joined the chat.`);
  });

  socket.on('createMessage', (message) => {
    io.emit('newMessage', message);
    console.log('createMessage', message);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('fromAdmin', {
      text: `${socket.user.name} has left the chat.`,
    });

    console.log(`${socket.user.name} has joined the chat.`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
