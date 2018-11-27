const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage() /server/utils/message', () => {
  it('should generate correct message object', () => {
    const from = 'TestUser';
    const text = 'This is a test message';

    const message = generateMessage(from, text);

    expect(message).toMatchObject({
      from,
      text,
    });
    expect(typeof message.createdAt).toBe('number');
  });
});

describe('generateLocationMessage() /server/utils/message', () => {
  it('should generate correct location object', () => {
    const from = 'TestUser';
    const latitude = 45.4215;
    const longitude = -75.6972;
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const message = generateLocationMessage(from, latitude, longitude);

    expect(message).toMatchObject({
      from,
      url,
    });
    expect(typeof message.createdAt).toBe('number');
  });
});
