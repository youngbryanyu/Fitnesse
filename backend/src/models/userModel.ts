/* Schema definition for a user */
import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from './baseDocument';

/**
 * Interface for user document
 */
export interface IUser extends BaseDocument<IUser> {
  username: string;
  email: string;
  password: string;
}

/**
 * Schema for user document
 */
const userSchema = new Schema<IUser>(
  {
    /* _id is automatically created by MongoDB */
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

/* Create and export the user schema */
export const UserModel = mongoose.model<IUser>('User', userSchema);
