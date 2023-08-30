const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { logger } = require('./helpers/logger')

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/swagger/swagger.yaml');
const basicAuth = require('express-basic-auth');

let app
const port = process.env.SERVICE_PORT || 3001

const init = async () => {
  try {
    app = express()

    const whitelist = [
      `http://localhost:${port}`,
    ]

    app.use(cors(
        {
          origin(origin, callback) {
            const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
            callback(null, originIsWhitelisted);
          },
          credentials: true,
        }
      )
    )

    const swaggerUiOptions = {
      customCss: '.swagger-ui .topbar { display: none }',
    };

    const authorizer = (username, password) => {
      const userMatches = basicAuth.safeCompare(username, process.env.SWAGGER_USER_NAME || 'deel');
      const passwordMatches = basicAuth.safeCompare(
          password,
          process.env.SWAGGER_PASSWORD || 'deel'
      );
      return userMatches && passwordMatches;
    }

    app.use(
      '/api-docs',
      basicAuth({
        authorizer,
        challenge: true,
      }),
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, swaggerUiOptions)
    );

    app.use(bodyParser.json())
    app.use(cookieParser())

    const { routes } = require('./routes');
    routes(app)

    if (!module.parent) {
      app.listen(port, () => {
        logger.info(`Listening on Port ${port}`)
      })
    }
  } catch (error) {
    logger.error(`An error occurred: ${JSON.stringify(error)}`)
    process.exit(1);
  }
}

(async () => {
  app = await init()

  process.on('SIGTERM', async () => {
    logger.info(`Service finished with SIGTERM`);
  })
})()

module.exports = {
  app,
  init,
}