const moment = require('moment');

const generateMessage = (from, text) => {
  return {
    from,
    text: text,
    createdAt: moment().valueOf(),
  };
};

const generateLocationMessage = (from, latitude, longitude) => {
  const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
  return {
    from,
    url,
    createdAt: moment().valueOf(),
  }
};

module.exports = { generateMessage, generateLocationMessage };
