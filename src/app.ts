import http from 'http';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import { GraphQLError } from 'graphql';
import { ApolloServer } from 'apollo-server-express';

import { helper } from './utils/helper';
import { PORT } from './utils/constants';
import { schema } from './graphql_schema';
import { CustomError } from './types/error';
import { authMiddleware } from './middleware/auth';

export class App {
  private port: number;
  private app: express.Application;
  private httpServer: http.Server;

  constructor() {
    this.port = PORT;
    this.app = express();
    this.httpServer = http.createServer(this.app);
    helper.loadEnvVariables();
    this.initializeMiddleWare();
    this.intializeGraphql();
  }

  private initializeMiddleWare(): void {
    this.app.use(cors());
    this.app.use(json());
  }

  private intializeGraphql(): void {
    const server = new ApolloServer({
      schema,
      context: authMiddleware.handleGraphQLContext,
      subscriptions: {
        onConnect: authMiddleware.handleGraphQLSubscriptionContext,
      },
      formatError: (error: GraphQLError) => {
        if (!error.originalError) {
          return error;
        }
        const message = error.message || 'Unexpected error. Please try again.';
        const status = (<CustomError>error.originalError).status || 500;
        return { message, status };
      },
    });
    server.applyMiddleware({ app: this.app });
    server.installSubscriptionHandlers(this.httpServer);
  }

  public listen(): void {
    mongoose.set('useCreateIndex', true);
    mongoose
      .connect('mongodb://localhost:27017/stabilizer', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        this.httpServer.listen(this.port, () => {
          console.log(`Server is up and running...`);
        });
      })
      .catch((err) => console.log(err));
  }
}
