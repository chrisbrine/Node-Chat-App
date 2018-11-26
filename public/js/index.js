const socket = io();
const userName = prompt('Please enter your name', '');

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.emit('newUser', {
  name: userName,
});

socket.on('newMessage', function (message) {
  const messages = document.getElementById('messages');
  const nameDOM = document.createElement('span');
  const name = document.createTextNode(message.from + ': ');
  const newMessageDOM = document.createElement('p');
  const newMessage = document.createTextNode(message.text);
  nameDOM.appendChild(name);
  if (message.from !== userName) {
    nameDOM.classList.add('otherUser');
  }
  newMessageDOM.appendChild(nameDOM);
  newMessageDOM.appendChild(newMessage);
  messages.appendChild(newMessageDOM);
  console.log('newMessage', message);
});

socket.on('fromAdmin', function (message) {
  const messages = document.getElementById('messages');
  const newMessageDOM = document.createElement('p');
  const newMessage = document.createTextNode(message.text);
  newMessageDOM.classList.add('fromAdmin');
  newMessageDOM.appendChild(newMessage);
  messages.appendChild(newMessageDOM);
  console.log('newMessage', message);});

function createMessage(e) {
  const newMessage = document.getElementById('newMessage');
  const message = newMessage.value;

  newMessage.value = '';

  socket.emit('createMessage', {
    from: userName,
    text: message,
    createdAt: new Date().getTime(),
  });
}
