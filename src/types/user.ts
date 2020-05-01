import { Doc } from './doc';
import { TimeStamp } from './timestamp';

export interface IUser extends TimeStamp, Doc {
  name: string;
  password: string;
  type: string;
  address: string;
  phone: string;
  email: string;
}
