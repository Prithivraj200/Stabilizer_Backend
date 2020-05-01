import mongoose, { Schema } from 'mongoose';
import { IMachine } from '../types/machine';

const machineSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    machineType: {
      type: String,
      enum: ['SINGLE_PHASE', 'THREE_PHASE']
    },
    loadCapacity: {
      type: String,
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

export default mongoose.model<IMachine>('Machine', machineSchema);
