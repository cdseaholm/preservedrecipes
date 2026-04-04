import mongoose, { Model, Schema } from "mongoose";
import { IRecipe } from "./types/recipes/recipe";

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
      type: [{
        relatedRecipeID: String,
        stepId: Number,
        stepType: String,
        description: String,
        ingredientIds: [String],
        image: String,
        stepAlternate: [String]
      }],
      required: false
    },
    reviews: {
      type: [{
        authorId: { type: String },
        comment: { type: String, default: null },
        commentLikes: { type: [Boolean], required: false },
        inResponseToId: { type: String, default: null },
        rating: { type: Number, default: null },
        createdAt: { type: Date, default: null },
        updatedAt: { type: Date, default: null }
      }],
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
      type: [{
        ingredient: String,
        ingredientId: String,
        quantity: String
      }],
      required: false
    },
    tags: {
      type: [String],
      required: false
    },
    description: {
      type: String,
      required: false
    },
    cookingTime: {
      type: Number,
      required: false
    },
    recipeFor: {
      type: [String],
      required: false
    },
    favoriteCount: {
      type: Number,
      required: false,
      default: 0
    },
    saveCount: {
      type: Number,
      required: false,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.models?.Recipe || mongoose.model("Recipe", recipeSchema);

export default Recipe as Model<IRecipe>;