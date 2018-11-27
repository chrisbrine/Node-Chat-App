const expect = require('expect');

const { generateMessage } = require('./message');

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
