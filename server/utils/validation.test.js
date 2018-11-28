const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString() /server/utils/validation', () => {
  it('should reject non-string values', () => {
    const returnValue = isRealString(34);
    expect(returnValue).toBe(false);
  });
  it('should reject string with spaces', () => {
    const returnValue = isRealString('     ');
    expect(returnValue).toBe(false);
  });
  it('should allow string with non-space characters', () => {
    const returnValue = isRealString('   RealString   ');
    expect(returnValue).toBe(true);
  });
});
