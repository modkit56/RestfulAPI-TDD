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

  // POST
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

  it('should return 400 when password and firstname is not present', async () => {
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

  // GET
  it('should return 200 when user exists', async () => {
    getUserById.mockImplementation(() => ({
      id: '7ae2afe8-c8c2-4e51-b22e-72a70c21c0f6',
      username: 'peter',
      email: 'email@gmail.com',
      created_at: '01/01/2022',
      updated_at: '01/01/2022',
      version: '82fe55dc-da29-4dd3-af78-ee59623cb307',
    }));

    const res = await app.inject({
      method: 'GET',
      url: 'api/v1/users/7ae2afe8-c8c2-4e51-b22e-72a70c21c0f6',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      id: '7ae2afe8-c8c2-4e51-b22e-72a70c21c0f6',
      username: 'peter',
      email: 'email@gmail.com',
      created_at: '01/01/2022',
      updated_at: '01/01/2022',
      version: '82fe55dc-da29-4dd3-af78-ee59623cb307',
    });
  });

  it('should return 400 when userId is not valid uuid', async () => {
    getUserById.mockImplementation(() => ({
      id: '31d3c205-c9d3-4d8b-8fe2-0f21888d98a4',
      username: 'peter',
      email: 'email@gmail.com',
      createdAt: '01/01/2022',
      updatedAt: '01/01/2022',
      version: '11668866-d786-4171-9792-9ee7972c9335',
    }));

    const res = await app.inject({
      method: 'GET',
      url: 'api/v1/users/some-invalid-uuid',
    });

    expect(res.statusCode).toBe(400);
  });
});
