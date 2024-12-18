import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "./types/user";
import { recipeSchema } from "./recipe";
import { commentSchema } from "./comment";

export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    familyID: {
      type: String,
      default: ''
    },
    recipes: {
      type: [recipeSchema],
      default: []
    },
    comments: {
      type: [commentSchema],
      default: []
    },
    communityIDs: {
      type: [String],
      default: []
    },
    ratings: {
      type: [Number],
      default: []
    },
    siblingIDs: {
      type: [String],
      default: []
    },
    parentIDs: {
      type: [String],
      default: []
    },
    childrenIDs: {
      type: [String],
      default: []
    },
    partnerIDs: {
      type: [String],
      default: []
    },
    resetPasswordToken: {
      type: String,
      default: '',
    },
    resetPasswordExpires: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User as Model<IUser>;