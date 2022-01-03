const UserService = require('../../src/service/user.service');
const UserRepository = require('../../src/dal/user.dal');

// mocking the data access layer (dal) [ user.dal.js ]
const getUserByIdDal = jest.fn();
const saveUser = jest.fn();

jest.mock('../../src/dal/user.dal');

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
      created_at: '2022-01-01 13:46:33.934071+00',
      updated_at: '2022-01-01 13:46:33.934071+00',
      version: '1',
    });

    const user = await getUserById('user_uuid');

    expect(user).toEqual({
      id: 'uuid',
      username: 'peter middlename parker',
      email: 'email',
      created_at: '01/01/2022',
      updated_at: '01/01/2022',
      version: '1',
    });
  });

  // business logic test
  it('should return user with correct information', async () => {
    const { getUserById } = UserService({});
    getUserByIdDal.mockReturnValueOnce({
      id: 'uuid',
      first_name: 'peter',
      password: 'password',
      email: 'email',
      created_at: '2022-01-01 13:46:33.934071+00', // some sample timestamptz
      updated_at: '2022-01-01 13:46:33.934071+00',
      version: 'some uuid',
    });

    const user = await getUserById('user_uuid');

    expect(user).toEqual({
      id: 'uuid',
      username: 'peter',
      email: 'email',
      created_at: '01/01/2022', // dd-mm-yyyy
      updated_at: '01/01/2022',
      version: 'some uuid',
    });
  });
});
