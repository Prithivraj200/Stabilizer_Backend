import historyTypeDef from './schema';
import { historyResolver } from './resolver';

export const historySchema = {
  typeDefs: [historyTypeDef],
  resolvers: historyResolver
};
