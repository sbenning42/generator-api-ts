/**
 * Load `.env` file
 * Get `.env`'s config
 */
import dotenv from 'dotenv';

dotenv.config();
const {
  PORT = 4266, // Apply default port if not provided by `.env` file
  MONGO_URL
} = process.env;


const {
  NODE_ENV
} = process.env;

console.log(NODE_ENV);

/**
 * Standard `express` import statements
 */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';

import { l } from './utils/logger';
import { mainMongoService } from './database/mongo';

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

  l.info(`Connected to MongoDB at ${MONGO_URL}`);

  /**
   * Apply generated's APIs controllers
   */
  

  /**
   * Start `express` server
   */
  app.listen(PORT, () => {
    l.info(`Server up and running at http://localhost:${PORT}`);
  });

}

/**
 * Execute programme
 */
main().catch(e => console.error(e));
