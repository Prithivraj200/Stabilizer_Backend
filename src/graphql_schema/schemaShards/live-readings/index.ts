import liveReadingTypeDef from './schema';
import { liveReadingResolver } from './resolver';

export const liveReadingsSchema = {
  typeDefs: [liveReadingTypeDef],
  resolvers: liveReadingResolver
};
