const tempDal = require('../dal/temp.dal');

const tempService = (fastify) => {
  const dal = tempDal(fastify);

  const getAll = () => dal.getAll();

  const save = (title) => dal.save(title);

  return { getAll, save };
};

module.exports = tempService;
