/* Base document interface that all other interfaces extend */
import mongoose from 'mongoose';

/**
 * Base interface for a document
 */
export interface BaseDocument<T> extends Document {
  _id: mongoose.Schema.Types.ObjectId | string;
  _doc: T;
}
