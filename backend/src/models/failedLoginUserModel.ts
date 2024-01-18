/* Schema definition for recently failed login attempts of users */
import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "./baseDocument";
import Config from "simple-app-config";


/**
 * Interface for user with recently failed login attempts document
 */
export interface IFailedLoginUser extends BaseDocument<IFailedLoginUser> {
  userId: mongoose.Schema.Types.ObjectId,
  numFailed: number,
  createdAt: Date
}

/**
 * Schema for user with recently failed login attempts document
 */
const failedLoginUserSchema = new Schema<IFailedLoginUser>(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: 'User'
    },
    numFailed: {
      type: Number,
      default: 1
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expireAfterSeconds: Config.get('AUTH.FAILED_LOGIN_ATTEMPTS_WINDOW') } /* TTL index */
    }
  }
);

/* Create and export the user schema */
export const FailedLoginUserModel = mongoose.model<IFailedLoginUser>('FailedLoginUser', failedLoginUserSchema);
