# A Well-Designed and Tested Restful API
A 3-Layer Restful-API made using Fastify.js (in Node.js) with a Test-Driven-Development approach.

Documentation: https://project-one-back-end.herokuapp.com/swagger/static/index.html

The idea is to divide the RestfulAPI into three abstract layers namely:

- Repository Layer
[ this layer directly connects with the database ]
- Service Layer
[ this is the layer where the "bussiness logic" of the restfulAPI would take place ]
- Route Layer
[ this is the closest layer to the client; schema validation should be done here ]

The benefits of such arrangement include faster development and testing times as eacg layer could be developed and tested independently.

Testing Methodology:
- Write "Unit Tests" for each layer
- Write "Integration Tests"
- Manual testing using Thunder Client or PostmanAPI

Before trying to run this project make sure you have:
- Node
- npm
- Docker
- Batect

available react-scripts 

- npm start-prod
- npm start
- npm test
- npm test:watch
- npm lint
- npm lint:fix
- npm format

available batect scripts

- ./batect start-dev-db
- ./batect start-test-db
- ./batect say-hello
- ./batect install-dep
- ./batect test-ci
- ./batect lint
- ./batect start-server
- ./batect test-watch

To Run Locally:
- ./batect start-test-db
- npm run start
