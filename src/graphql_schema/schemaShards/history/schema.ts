import { gql } from 'apollo-server-express';

const historyTypeDef = gql`
  type History {
    _id: ID!
    machine: Machine!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    getHistoryCount: Int!
  }

  extend type Mutation {
    updatePendingStatus(id: ID!): History!
  }
`;

export default historyTypeDef;
