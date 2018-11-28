const socket = io();

let onlineUsers = [];

function checkScroll() {
  const messages = document.getElementById('messages');
  const newMessage = messages.lastElementChild;
  const previousMessage = newMessage.previousElementSibling;
  const clientHeight = messages.clientHeight;
  const scrollTop = messages.scrollTop;
  const scrollHeight = messages.scrollHeight;
  const newMessageHeight = newMessage.offsetHeight;
  const lastMessageHeight = previousMessage ? previousMessage.offsetHeight : 0;

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop = scrollHeight;
  }
}

// function validUserName(userName) {
//   return ((userName.trim()) && (userName.trim() !== adminUser));
// }

// while (!validUserName(userName)) {
//   userName = prompt('Please enter your name', '');
// }

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
  const createdAt = moment(message.createdAt).format('h:mm a');
  const template = document.getElementById('message-template');
  const html = Mustache.render(template.innerHTML, {
    text: message.text,
    from: message.from,
    createdAt,
  });

  const messages = document.getElementById('messages');
  messages.innerHTML += html;
  checkScroll();
});

socket.on('newLocationMessage', function (message) {
  const createdAt = moment(message.createdAt).format('h:mm a');
  const template = document.getElementById('location-message-template');
  const html = Mustache.render(template.innerHTML, {
    url: message.url,
    from: message.from,
    createdAt,
  });

  const messages = document.getElementById('messages');
  messages.innerHTML += html;
  checkScroll();
});

function createMessage() {
  const newMessage = document.getElementById('newMessage');
  const message = newMessage.value.trim();

  if (message) {
    socket.emit('createMessage', {
      from: userName,
      text: message,
      createdAt: new Date().getTime(),
    }, function () {
      newMessage.value = '';
    });
  }
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
