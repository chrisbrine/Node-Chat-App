const socket = io();
const userName = prompt('Please enter your name', '');
const adminUser = 'Admin';

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
  if (message.from !== adminUser) {
    nameDOM.appendChild(name);
    if (message.from !== userName) {
      nameDOM.classList.add('otherUser');
    }
    newMessageDOM.appendChild(nameDOM);
  } else {
    newMessageDOM.classList.add('fromAdmin');
  }
  newMessageDOM.appendChild(newMessage);
  messages.appendChild(newMessageDOM);
});

function createMessage(e) {
  const newMessage = document.getElementById('newMessage');
  const message = newMessage.value;

  newMessage.value = '';

  socket.emit('createMessage', {
    from: userName,
    text: message,
    createdAt: new Date().getTime(),
  }, (data) => {
    console.log('Got it!', data);
  });
}
