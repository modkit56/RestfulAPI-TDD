const moment = require('moment');
const JobService = require('../../service/job.service');
const { postRequestBody } = require('./job.schema');

const jobRoute = async (fastify) => {
  const { createJob, getJobs } = JobService(fastify);

  fastify.get('/', async (request, reply) => {});

  fastify.post(
    '/',
    {
      schema: { body: postRequestBody },
      preHandler: (request, reply, done) => {
        const { expiredAt } = request.body;
        const todayDate = moment().format('YYYY-MM-DD');

        if (expiredAt <= todayDate) {
          reply.code(400).send({ message: 'expired date must be future date' });
        }

        done();
      },
    },
    async (request, reply) => {
      const job = request.body;

      const jobId = await createJob(job);

      reply.code(201).send({ jobId });
    }
  );
};

module.exports = jobRoute;
