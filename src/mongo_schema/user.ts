import mongoose, { Schema } from 'mongoose';

import { IUser } from './../types/user';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['ADMIN', 'DEALER', 'USER']
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
