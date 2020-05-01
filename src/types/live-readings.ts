import { Doc } from './doc';
import { TimeStamp } from './timestamp';

export interface ILive extends TimeStamp, Doc {
  machine: string;
  readings: string;
  creator: string;
}
