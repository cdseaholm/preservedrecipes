import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "./types/user";
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
    recipeIDs: {
      type: [String],
      default: []
    },
    communityIDs: {
      type: [String],
      default: []
    },
    secretViewableRecipeIDs: {
      type: [String],
      default: [],
      required: false
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