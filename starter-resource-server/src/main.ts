/**
 * Standard `express` import statements
 */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { L } from './common/logger';
import { mainUseService } from './modules/use/service';
import { environment } from './environment';

const {
  port
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
    cors(), // use `origin: '*'` cors HTTP Headers
    morgan('combined'), // use some HTTP logging support
  );

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
