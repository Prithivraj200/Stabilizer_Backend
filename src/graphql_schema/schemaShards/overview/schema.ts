import { gql } from 'apollo-server-express';

const overviewTypeDef = gql`
  type Dashboard {
    pendingCount: Int!
    userCount: Int!
    dealerCount: Int!
  }

  extend type Query {
    getDashboardOverview: Dashboard!
  }
`;

export default overviewTypeDef;
