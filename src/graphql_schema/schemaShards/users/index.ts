import userTypeDef from './schema';
import { userResolver } from './resolver';

export const userSchema = {
  resolvers: userResolver,
  typeDefs: [userTypeDef]
};
