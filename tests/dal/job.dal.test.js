const moment = require('moment');
const Fastify = require('fastify');
const jobRepository = require('../../src/dal/job.dal');
const userRepository = require('../../src/dal/user.dal'); // need to have a user in test-db to check jobRepository
const dbPlugin = require('../../src/plugin/database');

let app;
let userId;

describe('Job Repository', () => {
  const getUserId = async () => {
    const user = {
      first_name: 'peter',
      last_name: 'parker',
      password: 'passowrd',
      email: 'email@email.com',
    };
    const { saveUser } = userRepository(app.db);
    const id = await saveUser(user);

    return id;
  };

  beforeAll(async () => {
    app = Fastify();
    app.register(dbPlugin);
    await app.ready();
    userId = await getUserId();
  });

  afterEach(async () => {
    await app.db.query('delete from jobs');
  });

  it('should save job data in db', async () => {
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');
    const { save } = jobRepository(app.db);
    const jobId = await save({
      title: 'title test',
      description: 'description',
      skills: 'skills',
      min_budget: 100,
      max_budget: 200,
      expired_at: futureDate,
      user_id: userId,
    });

    expect(jobId).toBeDefined();
  });

  it('should throw error when userId is null', async () => {
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');
    const { save } = jobRepository(app.db);

    await expect(
      save({
        title: 'title test',
        description: 'description',
        skills: 'skills',
        min_budget: 100,
        max_budget: 200,
        expired_at: futureDate,
        user_id: null,
      })
    ).rejects.toThrow(Error('Failed to save in database'));
  });

  it('should get job data', async () => {
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');
    const { save, getAll } = jobRepository(app.db);

    await save({
      title: 'title test 1',
      description: 'description 1',
      skills: 'skills 1',
      min_budget: 100,
      max_budget: 200,
      expired_at: futureDate,
      user_id: userId,
    });

    await save({
      title: 'title test 2',
      description: 'description 2',
      skills: 'skills 2',
      min_budget: 100,
      max_budget: 200,
      expired_at: futureDate,
      user_id: userId,
    });

    const jobs = await getAll(1, 0); // limits: 1 record, offset: how many we want to skip from start

    expect(jobs.length).toEqual(1);
    expect(jobs[0].title).toEqual('title test 1');

    const nextJobs = await getAll(1, 1);
    expect(nextJobs.length).toEqual(1);
    expect(nextJobs[0].title).toEqual('title test 2');
  });

  it('should get all job data and filter expired jobs', async () => {
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');
    const { save, getAll } = jobRepository(app.db);

    await save({
      title: 'title test 1',
      description: 'description 1',
      skills: 'skills 1',
      min_budget: 100,
      max_budget: 200,
      expired_at: futureDate,
      user_id: userId,
    });

    await save({
      title: 'title test 2',
      description: 'description 2',
      skills: 'skills 2',
      min_budget: 100,
      max_budget: 200,
      expired_at: '2000-01-01', // has expired already
      user_id: userId,
    });

    const jobs = await getAll(2, 0); // limits: 1 record, offset: how many we want to skip from start

    expect(jobs.length).toEqual(1);
    expect(jobs[0].title).toEqual('title test 1');
  });
});
