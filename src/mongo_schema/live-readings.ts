import mongoose, { Schema } from 'mongoose';
import { ILive } from '../types/live-readings';

const liveReadingSchema = new Schema(
  {
    readings: {
      type: String,
      required: true
    },
    machine: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Machine'
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<ILive>('LiveReadings', liveReadingSchema);
