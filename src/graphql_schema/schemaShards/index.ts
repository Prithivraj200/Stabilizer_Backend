import { userSchema } from './users';
import { historySchema } from './history';
import { MachineSchema } from './machine';
import { overviewSchema } from './overview';
import { liveReadingsSchema } from './live-readings';
import { mergeRawSchemas } from '../../utils/merge-schemas';

export const schemaShards = mergeRawSchemas(
  userSchema,
  MachineSchema,
  overviewSchema,
  liveReadingsSchema,
  historySchema
);
