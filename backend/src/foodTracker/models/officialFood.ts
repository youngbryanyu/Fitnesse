/* Interface for an official food item from 3P sources */
import mongoose, { Schema } from 'mongoose';
import { IFood } from './food';

/**
 * Interface for an official food item
 */
export interface IOfficialFood extends IFood {
  userId: mongoose.Schema.Types.ObjectId;
  lastUsed: Date;
}

/**
 * Schema for an official food item
 */
const officialFoodSchema = new Schema<IOfficialFood>({
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

// TODO: finish schema

// /* Create index on userId */
officialFoodSchema.index({ userId: 1 });

/* Create and export the model */
export const OfficialFood = mongoose.model<IOfficialFood>('OfficialFood', officialFoodSchema);
