const UserService = require('../../src/service/user.service');
const UserRepository = require('../../src/dal/user.dal');

// mocking the data access layer (dal)
const getUserByIdDal = jest.fn();
const saveUser = jest.fn();

jest.mock('../../src/dal/user.dal');
// const { getUserById, createUser } = UserService({});

describe('user service', () => {
  beforeAll(() => {
    UserRepository.mockImplementation(() => ({
      getUserById: getUserByIdDal,
      saveUser,
    }));
  });

  it('should save user when user data is valid', async () => {
    const { createUser } = UserService({});
    saveUser.mockReturnValueOnce('user_uuid');
    const user = {
      first_name: 'peter',
      last_name: 'parker',
      password: 'password',
      email: 'email',
    };

    const userId = await createUser(user);

    expect(userId).toEqual('user_uuid');
    expect(saveUser).toHaveBeenCalledWith(user);
  });

  it('should return user when userID exists', async () => {
    const { getUserById } = UserService({});
    getUserByIdDal.mockReturnValueOnce({
      id: 'uuid',
      first_name: 'peter',
      middle_name: 'middlename',
      last_name: 'parker',
      password: 'password',
      email: 'email',
    });

    const user = await getUserById('user_uuid');

    expect(user).toEqual({
      id: 'uuid',
      username: 'peter middlename parker',
      email: 'email',
    });
  });

  // business logic test
  it('should return user with correct username', async () => {
    const { getUserById } = UserService({});
    getUserByIdDal.mockReturnValueOnce({
      id: 'uuid',
      first_name: 'peter',
      password: 'password',
      email: 'email',
    });

    const user = await getUserById('user_uuid');

    expect(user).toEqual({
      id: 'uuid',
      username: 'peter',
      email: 'email',
    });
  });
});
