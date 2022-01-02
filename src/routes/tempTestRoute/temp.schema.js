const postRequestBody = {
  type: 'object',
  required: ['title'],
  properties: {
    title: {
      type: 'string',
    },
  },
};

module.exports = {
  postRequestBody,
};
