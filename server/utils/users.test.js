const expect = require('expect');

const { Users } = require('./users');

describe('Users /server/utils/users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'TempUser',
      room: 'Temp Room'
    }, {
      id: '2',
      name: 'TempUser2',
      room: 'Temp Room2'
    }, {
      id: '3',
      name: 'TempUser3',
      room: 'Temp Room'
    }];
  });

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'TestUser',
      room: 'The Test Room',
    };
    const resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should return names from Temp Room', () => {
    const userList = users.getUserList(users.users[0].room);

    expect(userList).toEqual([users.users[0].name, users.users[2].name]);
  });

  it('should return names from Temp Room2', () => {
    const userList = users.getUserList(users.users[1].room);

    expect(userList).toEqual([users.users[1].name]);
  });

  it('should remove a user', () => {
    const userId = '2';
    const deletedUser = users.removeUser(userId);

    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    const userId = '99';
    const deletedUser = users.removeUser(userId);

    expect(users.users.length).toBe(3);
  });

  it('should find a user', () => {
    const userId = '2';
    const user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find a user', () => {
    const userId = '99';
    const user = users.getUser(userId);

    expect(user).toBeFalsy();
  });
});
