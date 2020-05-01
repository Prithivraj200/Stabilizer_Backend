import { gql } from 'apollo-server-express';

import { schemaShards } from './schemaShards';
import { mergeRawSchemas } from '../utils/merge-schemas';
import { makeExecutableSchema } from 'apollo-server-express';

const rawSchema = mergeRawSchemas(
  {
    typeDefs: [
      gql`
        type Message {
          message: String!
        }

        type Query {
          _empty: String
        }

        type Mutation {
          _empty: String
        }

        type Subscription {
          _empty: String
        }
      `
    ],
    resolvers: {}
  },
  schemaShards
);

export const schema = makeExecutableSchema(rawSchema);
