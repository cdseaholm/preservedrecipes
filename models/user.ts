import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "./types/user";
import { recipeSchema } from "./recipe";
import { userFamilySchema } from "./userFamily";

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
    userFamily: {
      type: userFamilySchema,
      default: {}
    },
    recipes: {
      type: [recipeSchema],
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