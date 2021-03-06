const express = require('express');
const { server: config } = require('config');
const boom = require('express-boom');
const { httpLogger, requestLogger } = require('./middlewares');

const createServer = logger => {
  const app = express();

  // parse incoming json data
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  // Register boom's http errors
  app.use(boom());

  // Register http logger to log all requests
  app.use(httpLogger);

  // append a logger instance to each request
  app.use(requestLogger);

  // Register Routes
  require('./services')(app);

  // Create server
  app.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`);
  });

  app.on('error', error => {
    throw error;
  });
};

module.exports = createServer;
