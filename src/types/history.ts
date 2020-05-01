import { Doc } from './doc';
import { TimeStamp } from './timestamp';

export interface IHistory extends TimeStamp, Doc {
  machine: string;
  creator: string;
}
