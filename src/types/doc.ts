import mongoose from 'mongoose';

export interface Doc extends mongoose.Document {
  _doc: Document;
}
