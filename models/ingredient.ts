import mongoose, { Model, Schema } from "mongoose";
import { IngredientType } from "./types/ingredientType";

export const ingredientSchema = new Schema(
  {
    ingredient: {
      type: String,
      required: false,
    },
    quantity: {
        type: String,
        required: false
    },
    quantityType: {
        type: String,
        required: false,
    },
    ingredientId: {
        type: Number,
        required: false
    }
  },
  {
    timestamps: true,
  }
);

const Ingredient = mongoose.models?.Ingredient || mongoose.model("Ingredient", ingredientSchema);

export default Ingredient as Model<IngredientType>;