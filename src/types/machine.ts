import { Doc } from './doc';
import { TimeStamp } from './timestamp';

export interface IMachine extends TimeStamp, Doc {
  name: string;
  description: string;
  machineType: string;
  loadCapacity: string;
  creator: string;
}
