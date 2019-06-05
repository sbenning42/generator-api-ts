export const environment = {
    port: process.env.PORT,
    uploadDir: process.env.UPLOAD_DIR,
    mongoUrl: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET,
    graphqlPath: process.env.GRAPHQL_PATH,
    swagger: process.env.SWAGGER_GENERATED,
    swaggerPath: process.env.SWAGGER_PATH,
    swaggerOptions: {
      swaggerOptions: {
        authAction: {
          JWT: {
            name: 'JWT',
            schema: {
              type: 'apiKey',
              in: 'header',
              name: 'Authorization',
              description: ''
            },
            value: 'Bearer <my own JWT token>'
          }
        }
      }
    }
};
