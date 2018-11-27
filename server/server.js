// Import necessary libraries
const path      = require('path');
const http      = require('http');
const express   = require('express');
const socketIO  = require('socket.io');

// Include local libraries
const { generateMessage } = require('./utils/message');

// Setup directory path variable
const publicPath = path.join(__dirname, '../public');

// Setup server variables
const port    = process.env.PORT || 3000;
const app     = express();
const server  = http.createServer(app);
const io      = socketIO(server);

// Setup the public path directory for serving the frontend website
app.use(express.static(publicPath));

// Default settings
const adminUser = 'Admin';

// Start SocketIO

io.on('connection', (socket) => {
  socket.user = { name: 'Guest' };

  socket.on('newUser', (user) => {
    socket.user = user;

    socket.emit('newMessage', generateMessage(adminUser, 'Welcome to the chat!'));

    socket.broadcast.emit('newMessage', generateMessage(adminUser, `${user.name} has joined the chat.`));

    console.log(`${user.name} has joined the chat.`);
  });

  socket.on('createMessage', (message, callback) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('data: ' + message.text);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('newMessage', generateMessage(adminUser, `${socket.user.name} has left the chat.`));

    console.log(`${socket.user.name} has left the chat.`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
