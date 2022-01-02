const tempService = require('../../service/temp.service');
const { postRequestBody } = require('./temp.schema');

// api/v1/test
const route = async (fastify) => {
  // get route
  const { getAll, save } = tempService(fastify);
  fastify.get('/', async (request, reply) => {
    const allTest = await getAll();
    reply.code(200).send(allTest);
  });

  // post route
  fastify.post(
    '/',
    { schema: { body: postRequestBody } },
    async (request, reply) => {
      fastify.log.info(`request with body ${request}`);
      const { title } = request.body;

      const id = await save(title);

      reply.code(201).send(id);
    }
  );
};

module.exports = route;
