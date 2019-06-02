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

const {
  port,
  swagger
} = environment;

const swaggerDocument = YAML.load(swagger);

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

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


  /**
   * Apply application handlers
   */
  await mainUseService.use(app);

  /**
   * Start `express` server
   */
  app.listen(port, () => {
    L.info(`Server up and running at http://localhost:${port}`);
  });

}

/**
 * Execute programme
 */
main().catch(e => console.error(e));
