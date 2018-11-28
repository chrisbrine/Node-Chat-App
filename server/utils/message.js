const moment = require('moment');

const generateMessage = (from, text) => {
  return {
    from,
    text: text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
       return '&#'+i.charCodeAt(0)+';';
    }),
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
