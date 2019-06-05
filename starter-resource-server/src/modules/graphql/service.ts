import graphqlHTTP from 'express-graphql';
import graphQLSchema from 'swagger-to-graphql';
import YAML from 'yamljs';

import { Singleton } from '../../common/singleton/singleton';
import { environment } from '../../environment';
import { Application } from 'express';

const {
    port,
    graphqlPath,
    swagger,
  } = environment;

export interface GraphqlServiceConfig {
    proxyUrl: string;
    pathToSwaggerSchema: string;
    customHeaders?: { [header: string]: string };
}

export class GraphqlService extends Singleton {

    private schema: any;

    constructor(public config: GraphqlServiceConfig) {
        super(GraphqlService);
    }

    async getSchema() {
        const {
            pathToSwaggerSchema,
            proxyUrl,
            customHeaders = {}
        } = this.config;
        const schema = await graphQLSchema(pathToSwaggerSchema, proxyUrl, customHeaders);
        this.schema = schema;
        return schema;
    }

    async applyMiddleware(app: Application) {
        if (!this.schema) {
            await this.getSchema();
        }
        app.use(graphqlPath, graphqlHTTP({ schema: this.schema, graphiql: true }));
    }

}

export const mainGraphqlService: GraphqlService = new GraphqlService({
    proxyUrl: `http://localhost:${port}`,
    pathToSwaggerSchema: swagger.replace('.yml', '.json'),
    customHeaders: {
        // Authorization: `Bearer <token>`
    }
});
