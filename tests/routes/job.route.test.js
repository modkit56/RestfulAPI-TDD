const moment = require('moment');
const Fastify = require('fastify');

const jobRoute = require('../../src/routes/job');

const JobService = require('../../src/service/job.service');

jest.mock('../../src/service/job.service');

const createJob = jest.fn();
const getJobs = jest.fn();

// { createJob, getJobs }
JobService.mockImplementation(() => ({
  createJob,
  getJobs,
}));

let app;

describe('job route', () => {
  beforeAll(async () => {
    app = Fastify();
    app.register(jobRoute, { prefix: 'api/v1/jobs' });
    await app.ready();
  });

  // POST TESTS
  it('should return 201 when job data is valid', async () => {
    createJob.mockImplementation(() => 'uuid');
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/jobs',
      payload: {
        title: 'title',
        description: 'description',
        skills: 'skills',
        minBudget: '100',
        maxBudget: '200',
        expiredAt: futureDate,
        userId: 'uuid',
      },
    });

    expect(res.statusCode).toEqual(201);
  });

  it('should return 400 when some required field is missing', async () => {
    createJob.mockImplementation(() => 'uuid');
    const futureDate = moment().add(4, 'day').format('YYYY-MM-DD');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/jobs',
      payload: {
        description: 'description',
        skills: 'skills',
        minBudget: '100',
        maxBudget: '200',
        expiredAt: futureDate,
        userId: 'uuid',
      },
    });

    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 when expired date format is incorrect', async () => {
    createJob.mockImplementation(() => 'uuid');
    const futureDate = moment().add(4, 'day').format('DD-MM-YYYY');

    const res = await app.inject({
      title: 'title',
      method: 'POST',
      url: 'api/v1/jobs',
      payload: {
        description: 'description',
        skills: 'skills',
        minBudget: '100',
        maxBudget: '200',
        expiredAt: futureDate,
        userId: 'uuid',
      },
    });

    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 when expired date is not future date', async () => {
    createJob.mockImplementation(() => 'uuid');

    const res = await app.inject({
      title: 'title',
      method: 'POST',
      url: 'api/v1/jobs',
      payload: {
        title: 'title',
        description: 'description',
        skills: 'skills',
        minBudget: '100',
        maxBudget: '200',
        expiredAt: '2021-01-01',
        userId: 'uuid',
      },
    });

    expect(res.statusCode).toEqual(400);
  });

  // GET TESTS
});
