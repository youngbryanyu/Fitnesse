/* Schema definition for a users that have recently been locked out due to too many failed login attempts */
import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "./baseDocument";
import Config from "simple-app-config";

/**
 * Interface for locked out user user document
 */
export interface ILockedOutUser extends BaseDocument<ILockedOutUser> {
  userId: mongoose.Schema.Types.ObjectId,
  createdAt: Date
}

/**
 * Schema for locked out user document
 */
const lockedOutUserSchema = new Schema<ILockedOutUser>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expireAfterSeconds: Config.get('AUTH.LOCKOUT_TIME') } /* TTL index */
    }
  }
);

/* Create and export the user schema */
export const LockedOutUserModel = mongoose.model<ILockedOutUser>('LockedOutUser', lockedOutUserSchema);
