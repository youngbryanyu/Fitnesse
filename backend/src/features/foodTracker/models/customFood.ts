/* Interface for a custom food item created by a user */
import mongoose, { Schema } from 'mongoose';
import { IFood } from './food';

/**
 * Interface for a custom food item created by a user
 */
export interface ICustomFood extends IFood {
  userId: mongoose.Schema.Types.ObjectId;
  lastUsed: Date;
}

/**
 * Schema for a custom food item
 */
const customFoodSchema = new Schema<ICustomFood>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    default: ''
  },
  servingSize: {
    type: String,
    default: '1 serving'
  },
  nutritionFacts: {
    calories: {
      type: Number,
      default: 0
    },
    protein: {
      type: Number,
      default: 0
    },
    carbohydrates: {
      type: Number,
      default: 0
    },
    fat: {
      type: Number,
      default: 0
    }
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
});

// /* Create index on userId */
customFoodSchema.index({ userId: 1 });

/* Create and export the model */
export const CustomFood = mongoose.model<ICustomFood>('CustomFood', customFoodSchema);
