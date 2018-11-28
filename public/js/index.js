const socket = io();
const adminUser = 'Admin';

let userName = prompt('Please enter your name', '');

let onlineUsers = [];

function checkScroll() {
  const messages = document.getElementById('messages');
  messages.scrollTop = messages.scrollHeight;
}

function validUserName(userName) {
  return ((userName.trim()) && (userName.trim() !== adminUser));
}

while (!validUserName(userName)) {
  userName = prompt('Please enter your name', '');
}

socket.on('connect', function () {
  socket.emit('newUser', {
    name: userName,
  });
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  onlineUsers = [];
  console.log('Disconnected from server');
});

socket.on('refreshUsers', function (users) {
  onlineUsers = users;
  refreshUsers();
});

socket.on('newMessage', function (message) {
  const messages = document.getElementById('messages');
  const nameDOM = document.createElement('span');
  const name = document.createTextNode(message.from + ': ');
  const newMessageDOM = document.createElement('li');
  const newMessage = document.createTextNode(message.text);
  if (message.from !== adminUser) {
    nameDOM.appendChild(name);
    if (message.from !== userName) {
      nameDOM.classList.add('otherUser');
    } else {
      nameDOM.classList.add('thisUser');
    }
    newMessageDOM.appendChild(nameDOM);
  } else {
    newMessageDOM.classList.add('fromAdmin');
  }
  newMessageDOM.appendChild(newMessage);
  messages.appendChild(newMessageDOM);
  checkScroll();
});

socket.on('newLocationMessage', function (message) {
  const messages = document.getElementById('messages');
  const name = document.createTextNode(`${message.from} shared their current location. Click here for it.`);
  const newMessageDOM = document.createElement('li');
  const newMessage = document.createElement('a');
  newMessage.href = message.url;
  newMessage.target = '_blank';
  newMessage.appendChild(name);
  newMessageDOM.appendChild(newMessage);
  newMessageDOM.classList.add('geolocation');
  messages.appendChild(newMessageDOM);
  checkScroll();
});

function createMessage() {
  const newMessage = document.getElementById('newMessage');
  const message = newMessage.value;

  socket.emit('createMessage', {
    from: userName,
    text: message,
    createdAt: new Date().getTime(),
  }, function () {
    newMessage.value = '';
  });
}

document.addEventListener('DOMContentLoaded', function() {
  if (!navigator.geolocation) {
    const geoLocationButton = document.getElementById('send-location');
    geoLocationButton.classList.add('hidden');
  }
});

function sendLocation() {
  const geoLocationButton = document.getElementById('send-location');
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  geoLocationButton.disabled = true;
  geoLocationButton.innerHTML = 'Sending...';
  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      from: userName,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }, function () {
      geoLocationButton.innerHTML = 'Send Location';
      geoLocationButton.disabled = false;
    });
  }, function () {
    geoLocationButton.innerHTML = 'Send Location';
    geoLocationButton.disabled = false;
    alert('Failed to get geolocation to share.');
  });
}

function refreshUsers() {
  const userListDOM = document.getElementById('users');
  const userList = document.createElement('ul');
  userList.classList.add('usersList');
  for (let index = 0; index < onlineUsers.length; index++) {
    const user = document.createElement('li');
    const theUser = document.createTextNode(onlineUsers[index]);
    user.appendChild(theUser);
    userList.appendChild(user);
  }
  users.innerHTML = '';
  users.appendChild(userList);
}
