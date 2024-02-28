/* Schema definition for a user */
import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '../../common/baseDocument';
import { ActivityLevels, Sexes, WeightGoals } from '../constants';

/**
 * Interface for user document
 */
export interface IUser extends BaseDocument<IUser> {
  _id: string /* Use firebase UID */;
  age: number;
  sex: number;
  height: number /* store height in cm */;
  weight: number /* store weight in kg */;
  activityLevel: number;
  weightGoal: number;
  useMetric: boolean;
  goals: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema for user document
 */
const userSchema = new Schema<IUser>({
  _id: { type: String } /* _id defaults to unique and required */,
  age: { type: Number, required: true, min: 0, max: 150 },
  sex: {
    type: Number,
    required: true,
    enum: Object.values(Sexes).filter((value) => typeof value === 'number')
  },
  height: { type: Number, required: true, min: 0, max: 500 },
  weight: { type: Number, required: true, min: 0, max: 500 },
  activityLevel: {
    type: Number,
    required: true,
    enum: Object.values(ActivityLevels).filter((value) => typeof value === 'number')
  },
  weightGoal: {
    type: Number,
    required: true,
    enum: Object.values(WeightGoals).filter((value) => typeof value === 'number')
  },
  useMetric: { type: Boolean, required: true },
  goals: {
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, min: 0 },
    fat: { type: Number, required: true, min: 0 },
    carbohydrates: { type: Number, required: true, min: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/* Create and export the user model */
export const UserModel = mongoose.model<IUser>('User', userSchema);
