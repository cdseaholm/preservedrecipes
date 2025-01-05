import mongoose, { Model, Schema } from "mongoose";
import { StepType } from "./types/stepType";
import { ingredientSchema } from "./ingredient";

export const recipeStepSchema = new Schema(
  {
    image: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false
    },
    stepAlternates: {
        type: [String],
        required: false
    },
    ingredients: {
      type: [ingredientSchema],
      required: false
    },
    stepType: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const RecipeStep = mongoose.models?.RecipeStep || mongoose.model("RecipeStep", recipeStepSchema);

export default RecipeStep as Model<StepType>;