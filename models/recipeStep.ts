import mongoose, { Model, Schema } from "mongoose";
import { IRecipeStep } from "./types/recipeStep";

export const recipeStepSchema = new Schema(
  {
    image: {
        type: String,
        required: false,
    },
    instruction: {
        type: String,
        required: false
    },
    stepAlternates: {
        type: [String],
        required: false
    }
  },
  {
    timestamps: true,
  }
);

const RecipeStep = mongoose.models?.RecipeStep || mongoose.model("RecipeStep", recipeStepSchema);

export default RecipeStep as Model<IRecipeStep>;