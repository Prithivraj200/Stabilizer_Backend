import mongoose, { Schema } from 'mongoose';
import { IHistory } from './../types/history';

const historySchema = new Schema(
  {
    machine: {
      type: Schema.Types.ObjectId,
      ref: 'Machine',
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IHistory>('History', historySchema);
