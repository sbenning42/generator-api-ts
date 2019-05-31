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
import { mainMongoService } from './services/mongo/mongo.service';
import { UserAPI } from './generated-apis/user/user';
import { RoleAPI } from './generated-apis/role/role';
import { middlewaresMap } from './middlewares';
import { createUserController, createUserImprovedController } from './controllers/create-user';
import { hasTokenLogMiddleware } from './middlewares/has-token-log';
import { Schema } from 'mongoose';
import { test } from './utils/api-gen/test';
import { testLogGeneratedRouters } from './utils/api-gen/test-log-generated-router';

/**
 * Use async main function to get access to `await` keyword
 */
async function main() {

  const app = express();

  /**
   * Wait for database to connect
  */
  await mainMongoService.init();
  l.info(`Connected to MongoDB at ${MONGO_URL}`);

  /**
   * Apply some standard setup's middlewares
   */
  app.use(
    helmet(), // add various HTTP Headers for some security
    bodyParser.json(), // parse request body into JSON
    cors(), // use `origin: '*'` cors HTTP Headers
    morgan('combined'), // use some HTTP logging support
    passport.initialize() // initialize passport-js library
  );

  /**
   * Apply generated's APIs controllers
   */
  // new UserAPI(middlewaresMap).applyAPI(app);
  // new RoleAPI(middlewaresMap).applyAPI(app);

  /**
   * Define your own controllers
   */
  /*
  app.post('/users', hasTokenLogMiddleware, createUserImprovedController);

  const db = await mainMongoService.getDB();
  const Model = db.model('Data', new Schema({ data: String }));
  app.post('/data', async (req, res) => {
    const model = new Model({ data: req.body.data });
    const data = await model.save();
    res.json({ data: data.toObject() });
  });
  */

  //test();
  testLogGeneratedRouters(app);
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
