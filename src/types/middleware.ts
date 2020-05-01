import mongoose from 'mongoose';

export interface IContext {
  isAuth: boolean;
  userId: mongoose.Schema.Types.ObjectId | null;
}
