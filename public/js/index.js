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

function addMessage (date, from, text) {
  const formattedTime = moment(date).format('h:mm a');
  const messages = document.getElementById('messages');
  const newMessageDOM = document.createElement('li');

  let chatMessage;
  if (from !== adminUser) {
    chatMessage = `[${formattedTime}] ${from}: ${text}`;
  } else {
    chatMessage = `[${formattedTime}] ${text}`;
  }

  newMessageDOM.innerHTML = chatMessage;
  messages.appendChild(newMessageDOM);
  checkScroll();
}

socket.on('newMessage', function (message) {
  console.log(message);
  addMessage(message.createdAt, message.from, message.text);
});

socket.on('newLocationMessage', function (message) {
  const msgUrl = `<a href='${message.url}' target='_blank'>My Current Location</a>`;
  addMessage(message.createdAt, message.from, msgUrl);
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
