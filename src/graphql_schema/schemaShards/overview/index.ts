import overviewTypeDef from './schema';
import { overviewResolver } from './resolver';

export const overviewSchema = {
  typeDefs: [overviewTypeDef],
  resolvers: overviewResolver
};
