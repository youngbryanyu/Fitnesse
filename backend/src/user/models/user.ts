/* Schema definition for a user */
import mongoose, { Schema } from 'mongoose';
import { BaseDocument } from '../../baseDocument';

/**
 * Interface for user document
 */
export interface IUser extends BaseDocument<IUser> {
  _id: string /* Use firebase UID */;
  age: number;
  sex: number /* use enum mapping */;
  height: number /* store height in cm */;
  weight: number /* store weight in kg */;
  activityLevel: number /* use enum mapping */;
  useMetric: boolean;
  createdAt: Date;
  goals: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
}

/**
 * Schema for user document
 */
const userSchema = new Schema<IUser>(
  {
    _id: { type: String } /* _id defaults to unique and required */,
    age: { type: Number, required: true },
    sex: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    activityLevel: { type: Number, required: true },
    useMetric: { type: Boolean, required: true },
    goals: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      fat: { type: Number, required: true },
      carbohydrates: { type: Number, required: true }
    }
  },
  { timestamps: true }
);

/* Create and export the user model */
export const User = mongoose.model<IUser>('User', userSchema);
