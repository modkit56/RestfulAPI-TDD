const Fastify = require('fastify');

const userRoute = require('../../src/routes/user');
const UserService = require('../../src/service/user.service');

jest.mock('../../src/service/user.service');

const createUser = jest.fn();
const getUserById = jest.fn();

UserService.mockImplementation(() => ({
  getUserById,
  createUser,
}));

let app;

describe('user route', () => {
  beforeAll(async () => {
    app = Fastify();
    app.register(userRoute, { prefix: 'api/v1/users' });
    await app.ready();
  });

  it('should return 201 when called with valid user data', async () => {
    createUser.mockImplementation(() => 'uuid');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        first_name: 'peter',
        password: 'password',
        email: 'email@gmail.com',
      },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json().userId).toEqual('uuid');
  });

  it('should return 400 when user service throws error', async () => {
    createUser.mockImplementation(() => {
      throw Error('invalid data');
    });

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        first_name: 'peter',
        password: 'password',
        email: 'email@gmail.com',
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json().message).toEqual('invalid data');
  });

  it('should return 400 when email is in invalid format', async () => {
    createUser.mockImplementation(() => 'uuid');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        first_name: 'peter',
        password: 'password',
        email: 'email',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 when password and firtname is not present', async () => {
    createUser.mockImplementation(() => 'uuid');
    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        email: 'email@gmail.com',
      },
    });
    expect(res.statusCode).toBe(400);
  });
});
