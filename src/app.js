const fastify = require('fastify');
const db = require('./plugin/database');
const swaggerPg = require('./plugin/swagger');

const testRoute = require('./routes/tempTestRoute');
const userRoute = require('./routes/user');
const jobRoute = require('./routes/job');

const build = (opts = {}) => {
  const app = fastify(opts);

  // register plugins
  app.register(db);
  app.register(swaggerPg);

  // register routes
  app.register(testRoute, { prefix: 'api/v1/test' });
  app.register(userRoute, { prefix: 'api/v1/users' });
  app.register(jobRoute, { prefix: 'api/v1/jobs' });

  app.get('/', async (request, reply) => {
    reply.code(200).send({ nice: 'CI/CD Setup is Complete' });
  });

  return app;
};

module.exports = build;
