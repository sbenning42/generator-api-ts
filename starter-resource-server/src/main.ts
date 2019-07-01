/**
 * Standard `express` import statements
 */
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';


import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { L } from './common/logger';
import { environment } from './environment';
import { gen } from './lib/gen/core';
import { GenContext, P } from './lib/gen/types';
import { mainTodoRouter } from './generated-v2/todo/todo';
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

  try {
    const swaggerDocument = YAML.load(swagger);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
  } catch (error) {
    L.info('Cannot apply swagger.', error)
  }

  // const engine = new MyApiEngine(myApi);

  const { jwt, iOwn, hasRole } = gen.context.lib.middlewares;
  const { alwaysCan, alwaysCannot } = gen.context.lib.guards;

  gen.register({
      config: {
          jwtSecret: 'secret',
          passportFields: ['username', 'password'],
          iAmModelName: 'User',
          outDir: './src/generated-v2',
          genLibDir: '../../lib/gen',
      },
      apis: {
          user: {
              model: {
                  username: {
                      type: String, // the only required property
                      required: true,
                      unique: true,
                      validators: {
                          minLengthUsername: (s: string) => s.length < 3
                              ? { minLengthUsername: 'Username too short' } : null,
                          maxLengthUsername: (s: string) => s.length > 255
                              ? { maxLengthUsername: 'Username too long' } : null,
                      }
                  },
                  password: {
                      type: String,
                      required: true,
                      guards: {
                          canSelect: alwaysCannot, // [() => false]
                          canUpdate: alwaysCannot, // dedied web service
                      },
                      validators: {
                          minLengthPassword: (s: string) => s.length < 8
                              ? { minLengthPassword: 'Password too short' } : null,
                          maxLengthPassword: (s: string) => s.length > 255
                              ? { maxLengthPassword: 'Password too long' } : null,
                      }
                  },
                  roles: {
                      type: [String],
                      required: true,
                      default: ['user'],
                      guards: {
                          canCreate: alwaysCannot,
                          canUpdate: [({ user }: GenContext) => P('admin' in user.roles ? null : { notAuthorized: 'Not Authorized' })],
                      },
                      validators: {
                          allowedRoles: (roles: string[]) => roles.every(role => ['user', 'admin'].includes(role))
                              ? { allowedRoles: `Unknom role in ${roles}` } : null,
                      }
                  },
                  email: {
                      type: String, // the only required property
                      required: true,
                      unique: true,
                      validators: {
                          minLengthUsername: (s: string) => s.length < 8
                              ? { minLengthUsername: 'Username too short' } : null,
                          maxLengthUsername: (s: string) => s.length > 255
                              ? { maxLengthUsername: 'Username too long' } : null,
                      }
                  },
                  birthdate: {
                      type: Date, // the only required property
                      required: true,
                  },
                  json: {
                      type: Object, // the only required property
                      default: {},
                  },
                  todos: {
                      type: ['Todo'],
                      default: [],
                      guards: {
                          canCreate: alwaysCannot,
                          canUpdate: alwaysCannot,
                      },
                      populate: true
                  }
              },
              webServices: {
                  all: {
                      middlewares: [jwt, hasRole('iAm', 'admin')]
                  },
                  'POST /': {
                      excludes: { 0: true, 1: true },
                  },
                  'DELETE /:id': {
                      middlewares: [hasRole('admin')], 
                      excludes: { 1: true },
                  },
                  'PUT /:id/password': {
                      middlewares: [
                          (req: Request, res: Response) => {
                              res.json({ message: 'not implemented' });
                          }
                      ]
                  }
              }
          },
          todo: {
              model: {
                  title: {
                      type: String,
                      required: true,
                      unique: true,
                  },
                  done: {
                      type: Boolean,
                      required: true,
                      default: false,
                  },
                  json: {
                      type: Object,
                      default: {},
                  },
                  author: {
                      type: 'User',
                      required: true,
                      default: () => gen.context.user.id,
                      guards: {
                          canCreate: alwaysCannot,
                          canUpdate: alwaysCannot,
                      },
                      reverse: ['todos'],
                      populate: true
                  }
              },
              webServices: {
                  all: {
                      middlewares: [jwt]
                  },
                  mutation: {
                      middlewares: [hasRole('iOwn', 'admin')]
                  },
                  'GET /:id/author': {
                      middlewares: [hasRole('iOwn', 'admin')]
                  }
              }
          }
      },
  });
  await mainMongoService.db();
  const generate = false;
  if (generate) {
    gen.generate();
  } else {
    gen.generate(false);
    mainTodoRouter.initialize();
    mainTodoRouter.applyRouter(app);
  }
  ///*
  //*/

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
