/**
 * Standard `express` import statements
 */
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';


import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { L } from './common/logger';
import { environment } from './environment';
import { mainUserRouter } from './lib/goal/types';
import { getCtx } from './lib/goal/ctx';
import { mainMongoService } from './modules/mongo/service';

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

  /*
  try {
    const swaggerDocument = YAML.load(swagger);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
  } catch (error) {
    L.info('Cannot apply swagger.', error)
  }
  */

  await mainMongoService.init();

  // const engine = new MyApiEngine(myApi);

  const ctx = getCtx();
  ctx.schema = {
      user: {
          webServices: {
              'GET /': {
                  middlewares: [
                      (req: Request, res: Response, next: NextFunction) => {
                          console.log(`In 'GET /' mniddlewares... Calling 'next()';`);
                          next();
                      }
                  ]
              },
              'POST /': {
                  middlewares: []
              },
              'GET /:id': {
                  middlewares: []
              },
              'PUT /:id': {
                  middlewares: []
              },
              'DELETE /:id': {
                  middlewares: []
              }
          }
      }
  };

  mainUserRouter.applyRouter(app);

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
