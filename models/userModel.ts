import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "./types/user";
import { userPreferencesSchema } from "./userPreferencesModel";
import { vacationSchema } from "./vacationModel";

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
    userPreferences: {
      type: userPreferencesSchema,
      required: false,
    },
    vacations: {
      type: [vacationSchema],
      required: false,
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