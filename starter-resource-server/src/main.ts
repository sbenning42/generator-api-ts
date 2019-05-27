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
import express, { Request, Response, NextFunction } from 'express';
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

  const middlewaresMap = {
    isAuthentified: (req: Request, res: Response, next: NextFunction) => {
      console.log('Youpi !');
      next();
    },
    isAdmin: (req: Request, res: Response, next: NextFunction) => {
      console.log('Houra !')
      next();
    },
    isOwner: (req: Request, res: Response, next: NextFunction) => {
      console.log('Yep !')
      next();
    },
  };
  /**
   * Apply generated's APIs controllers
   */
  new RoleAPI(middlewaresMap).applyAPI(app);
  new ScopeAPI(middlewaresMap).applyAPI(app);
  new CredentialAPI(middlewaresMap).applyAPI(app);
  new ProfilAPI(middlewaresMap).applyAPI(app);
  new UserAPI(middlewaresMap).applyAPI(app);
  new TodoAPI(middlewaresMap).applyAPI(app);

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
