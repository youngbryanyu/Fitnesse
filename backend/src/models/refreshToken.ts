/* Schema definition for refresh tokens (login session tokens) */
import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from './baseDocument';
import Config from 'simple-app-config';

/**
 * Interface for refresh token document
 */
export interface IRefreshToken extends BaseDocument<IRefreshToken> {
  userId: mongoose.Schema.Types.ObjectId;
  lastUsed: Date /* Last refresh or successful access token verification */;
  token: string;
}

/**
 * Schema for refresh token document
 */
const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  lastUsed: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: Config.get('AUTH.IDLE_TIMEOUT') } /* TTL index */
  },
  token: {
    type: String,
    required: true
  }
});

/* Create compound index on userId and token */
refreshTokenSchema.index({ userId: 1, token: 1 }, { unique: true });

/* Create and export the refresh token model */
export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
