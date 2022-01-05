const Fastify = require('fastify');
const userRepository = require('../../src/dal/user.dal');
const dbPlugin = require('../../src/plugin/database');

let app;

describe('User Repository', () => {
  beforeAll(async () => {
    app = Fastify();
    app.register(dbPlugin);
    await app.ready();
  });

  // in case local container is running and we don't want persistant data
  beforeEach(async () => {
    await app.db.query('delete from jobs');
    await app.db.query('delete from users');
  });

  it('should save user in db', async () => {
    const user = {
      first_name: 'peter',
      last_name: 'parker',
      password: 'password',
      email: 'email',
    };

    const { saveUser } = userRepository(app.db);

    const userId = await saveUser(user);

    expect(userId).toBeDefined();
  });

  it('should throw error when required filed is not present', async () => {
    const user = {
      first_name: 'peter',
      last_name: 'parker',
    };

    const { saveUser } = userRepository(app.db);

    await expect(saveUser(user)).rejects.toThrow(Error('Not Valid User Data'));
  });

  //

  it('should return userId if it exists in db', async () => {
    const user = {
      first_name: 'peter',
      last_name: 'parker',
      password: 'password',
      email: 'email',
    };

    const { saveUser, getUserById } = userRepository(app.db);

    const userId = await saveUser(user);
    // console.log(userId); to obtain dummy id for next test
    const dbUser = await getUserById(userId);

    expect(dbUser.first_name).toEqual('peter');
    // expect(dbUser.lastName).toEqual('parker');
    // expect(dbUser.password).toEqual('password');
    // expect(dbUser.email).toEqual('email');
  });

  it('should throw expection if the user doesnt exist', async () => {
    const { getUserById } = userRepository(app.db);
    await expect(
      getUserById('27ad34b0-45cf-43eb-ac65-a662175a1917')
    ).rejects.toThrow('27ad34b0-45cf-43eb-ac65-a662175a1917 does not exist');
  });
});
