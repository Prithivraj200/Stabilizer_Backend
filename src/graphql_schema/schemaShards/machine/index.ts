import machineTypeDef from './schema';
import { machineResolver } from './resolver';

export const MachineSchema = {
  typeDefs: [machineTypeDef],
  resolvers: machineResolver
};
