const socket = io();
const adminUser = 'Admin';

let userName = prompt('Please enter your name', '');

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
  console.log('Disconnected from server');
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
    } else {
      nameDOM.classList.add('thisUser');
    }
    newMessageDOM.appendChild(nameDOM);
  } else {
    newMessageDOM.classList.add('fromAdmin');
  }
  newMessageDOM.appendChild(newMessage);
  messages.appendChild(newMessageDOM);
});

socket.on('newLocationMessage', function (message) {
  const messages = document.getElementById('messages');
  // const nameDOM = document.createElement('span');
  const name = document.createTextNode(`${message.from} shared their current location. Click here for it.`);
  const newMessageDOM = document.createElement('p');
  const newMessage = document.createElement('a');
  newMessage.href = message.url;
  newMessage.target = '_blank';
  newMessage.appendChild(name);
  // nameDOM.appendChild(name);
  // newMessageDOM.appendChild(nameDOM);
  newMessageDOM.appendChild(newMessage);
  newMessageDOM.classList.add('geolocation');
  messages.appendChild(newMessageDOM);
});

function createMessage() {
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

document.addEventListener('DOMContentLoaded', function() {
  if (!navigator.geolocation) {
    const geoLocationButton = document.getElementById('geolocationbutton');
    geoLocationButton.classList.add('hidden');
  }
});

function sendLocation() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      from: userName,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, function () {
    alert('Failed to get geolocation to share.');
  });
}
