/**
 * Load `.env` file
 * Get `.env`'s process config
 */
import dotenv from 'dotenv';

dotenv.config();
const {
  PORT = 4266, // Apply default port if not provided by `.env` file
} = process.env;

/**
 * Standard `express` import statements
 */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';

/**
 * MongoDB config
 */
import { mainMongoService } from './database/mongo';

/**
 * Generated APIs
 */
import {
  RoleAPI,
  
  ScopeAPI,
  CredentialAPI,
  ProfilAPI,
  UserAPI,
  TodoAPI

} from './apis/apis';

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
    cors(), // use `origin: '*'` cors headers
    morgan('combined'), // use some logging support
    passport.initialize() // initialize passport-js library
  );

  /**
   * Wait for database to connect
  */
  await mainMongoService.init();

  /**
   * Apply generated's APIs controllers
   */
  new RoleAPI().applyAPI(app);
  
  new ScopeAPI().applyAPI(app);
  new CredentialAPI().applyAPI(app);
  new ProfilAPI().applyAPI(app);
  new UserAPI().applyAPI(app);
  new TodoAPI().applyAPI(app);

  /**
   * Start express server
   */
  app.listen(PORT, () => {
    console.log(`Server up and running at http://localhost:${PORT}`);
  });

}

/**
 * Well ... Execute script ...
 */
main().catch(e => console.error(e));
