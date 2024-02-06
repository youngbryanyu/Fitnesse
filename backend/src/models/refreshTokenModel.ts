/* Schema definition for refresh tokens (login tokens) */
import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from './baseDocument';
import Config from 'simple-app-config';

/**
 * Interface for refresh token document
 */
export interface IRefreshToken extends BaseDocument<IRefreshToken> {
  userId: mongoose.Schema.Types.ObjectId;
  lastUsed: Date /* Last successful refresh */;
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

/* Create and export the user schema */
export const RefreshTokenModel = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
