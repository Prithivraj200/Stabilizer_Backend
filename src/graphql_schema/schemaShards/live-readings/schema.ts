import { gql } from 'apollo-server-express';

const liveReadingTypeDef = gql`
  input LiveInput {
    readings: String!
    machineId: String!
  }

  type LiveReadings {
    _id: ID!
    readings: String!
    machine: Machine!
    createdAt: String!
    updatedAt: String!
  }

  type PendingReadings {
    _id: ID!
    creator: User!
    machine: Machine!
    createdAt: String!
    updatedAt: String!
  }

  type PendingList {
    pendingReadings: [PendingReadings!]!
    totalCount: Int!
  }

  extend type Query {
    getPendingList(page: Int!): PendingList!
  }

  extend type Mutation {
    addLiveReadings(liveInput: LiveInput): Message!
  }

  extend type Subscription {
    getLiveReadingById: LiveReadings!
  }
`;

export default liveReadingTypeDef;
