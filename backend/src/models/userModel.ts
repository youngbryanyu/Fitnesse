/* Schema definition for a user */
import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface for MongoDB user document
 */
export interface IUser extends Document {
  username: string,
  email: string,
  password: string,
}

/**
 * Schema for MongoDB user document
 */
const UserSchema = new Schema<IUser>(
  {
    /* _id is automatically created by MongoDB */
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
  }, 
  { 
    timestamps: true 
  }
)

/* Create and export the user schema */
export const UserModel = mongoose.model<IUser>('User', UserSchema);