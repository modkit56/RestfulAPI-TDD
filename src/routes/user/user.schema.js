const postRequestBody = {
  type: 'object',
  required: ['first_name', 'password', 'email'],
  properties: {
    first_name: {
      type: 'string',
    },
    middle_name: {
      type: 'string',
    },
    last_name: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

const postResponseBody = {
  210: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: {
        type: 'string',
        format: 'uuid',
      },
    },
  },
  400: {
    type: 'object',
    required: ['statusCode', 'error', 'message'],
    properties: {
      statusCode: {
        type: 'number',
      },
      error: {
        type: 'string',
      },
      message: {
        type: 'string',
      },
    },
  },
};

const getRequestParams = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      format: 'uuid',
    },
  },
};

const getResponseBody = {
  200: {
    type: 'object',
    required: [
      'id',
      'username',
      'email',
      'created_at',
      'updated_at',
      'version',
    ],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
      },
      username: {
        type: 'string',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      created_at: {
        type: 'string',
      },
      updated_at: {
        type: 'string',
      },
      version: {
        type: 'string',
      },
    },
  },
};

module.exports = {
  postRequestBody,
  postResponseBody,
  getRequestParams,
  getResponseBody,
};
