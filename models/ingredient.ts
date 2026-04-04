import mongoose, { Model, Schema } from "mongoose";
import { IIngredient } from "./types/recipes/ingredient";

export const ingredientSchema = new Schema(
  {
    ingredient: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Ingredient = mongoose.models?.Ingredient || mongoose.model("Ingredient", ingredientSchema);

export default Ingredient as Model<IIngredient>;