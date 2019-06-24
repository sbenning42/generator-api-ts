/**
 * Standard `express` import statements
 */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';


import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { L } from './common/logger';
import { mainUseService } from './modules/use/service';
import { environment } from './environment';
import { test } from './common/my-api/test';
import { MyApiEngine } from './lib/my-api/engine';
import { myApi } from './lib/my-api/goal';

const {
  port,
  swagger,
  swaggerPath,
  swaggerOptions
} = environment;

/**
 * Use async main function to get access to `await` keyword
 */
async function main() {

  const app = express();

  /**
   * Apply some standard setup's middlewares
   */
  app.use(
    helmet(), // add various HTTP Headers for some security
    bodyParser.json(), // parse request body into JSON
    bodyParser.urlencoded({ extended: true }), // enable extended encoded urls
    cors(), // use `origin: '*'` cors HTTP Headers
    morgan('combined'), // use some HTTP logging support
  );

  try {
    const swaggerDocument = YAML.load(swagger);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
  } catch (error) {
    L.info('Cannot apply swagger.', error)
  }

  const engine = new MyApiEngine(myApi);

  /**
   * Apply application handlers
   */
  // test()
  // await mainUseService.use(app);

  /**
   * Start `express` server
   */
  app.listen(port, () => {
    L.info(`Server up and running. Swagger at http://localhost:${port}/${swaggerPath}`);
  });

}

/**
 * Execute programme
 */
main().catch(e => console.error(e));
