const postRequestBody = {
  type: 'object',
  required: [
    'title',
    'description',
    'skills',
    'minBudget',
    'maxBudget',
    'expiredAt',
    'userId',
  ],
  properties: {
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    skills: {
      type: 'string',
    },
    minBudget: {
      type: 'number',
    },
    maxBudget: {
      type: 'number',
    },
    expiredAt: {
      type: 'string',
      format: 'date', // YYYY-MM-DD
    },
    userId: {
      type: 'string',
    },
  },
};

module.exports = {
  postRequestBody,
};
