const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
  });

  server.route(routes);

  await server.start();
  // eslint-disable-next-line no-console
  console.log('Server running on port 9000');
};

init();
