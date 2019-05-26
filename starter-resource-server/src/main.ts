/**
 * Load .env file
 */
import dotenv from 'dotenv';
dotenv.config();

/**
 * Get .env config
 */
const { PORT = 4266 } = process.env;

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';

import { mainMongoService } from './database/mongo';
import {
  RoleAPI,
  ScopeAPI,
  CredentialAPI,
  ProfilAPI,
  UserAPI
} from './apis/apis';

/**
 * Use async main function to get access to await
 */
async function main() {

  const app = express();
  
  /**
   * Apply some standard setup's middlewares
   */
  app.use(
    helmet(), // add various HTTP Headers for some security
    bodyParser.json(), // parse request body into JSON
    cors(), // use origin: '*' cors headers
    morgan('combined'), // use some logging support
    passport.initialize() // initialize passport-js library
  );

  /**
   * Wait for database to connect
  */
  await mainMongoService.init();

  new RoleAPI().applyRouter(app);
  new ScopeAPI().applyRouter(app);
  // new CredentialAPI().applyRouter(app);
  new ProfilAPI().applyRouter(app);
  new UserAPI().applyRouter(app);

  app.listen(PORT, () => {
    console.log(`Server up and running at http://localhost:${PORT}`);
  });

}

main().catch(e => console.error(e));
