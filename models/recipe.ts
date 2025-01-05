import mongoose, { Model, Schema } from "mongoose";
import { IRecipe } from "./types/recipe";
import { commentSchema } from "./comment";
import { recipeStepSchema } from "./recipeStep"; // Adjust the import path as necessary
import { ratingSchema } from "./rating";
import { ingredientSchema } from "./ingredient";

export const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    recipeType: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false,
    },
    creatorID: {
        type: String,
        required: false
    },
    steps: {
        type: [recipeStepSchema],
        required: false
    },
    ratings: {
        type: [ratingSchema],
        required: false
    },
    comments: {
        type: [commentSchema],
        required: false
    },
    secret: {
        type: Boolean,
        required: false
    },
    secretViewerIDs: {
        type: [String],
        required: false
    },
    ingredients: {
      type: [ingredientSchema],
      required: false
    },
    tags: {
      type: [String],
      required: false
    },
    description: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.models?.Recipe || mongoose.model("Recipe", recipeSchema);

export default Recipe as Model<IRecipe>;