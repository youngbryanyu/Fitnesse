/* Interface that all official and custom food documents extend */
import { BaseDocument } from '../../common/baseDocument';

/**
 * Interface for a generic food document that is trackable
 */
export interface IFood extends BaseDocument<IFood> {
  name: string;
  brand: string;
  servingSize: string;
  nutritionFacts: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
}
