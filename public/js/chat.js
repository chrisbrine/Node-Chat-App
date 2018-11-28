const socket = io();

let userName;
let userInfo;
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

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

socket.on('connect', function () {
  const params = getUrlVars();

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {

    }
  });
});

socket.on('disconnect', function () {
  onlineUsers = [];
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  const userListDOM = document.getElementById('users');
  let usersHTML = '';
  for (let index = 0; index < users.length; index++) {
    const template = document.getElementById('user-template');
    usersHTML += Mustache.render(template.innerHTML, {
      name: users[index],
    });
  }
  userListDOM.innerHTML = usersHTML;
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
