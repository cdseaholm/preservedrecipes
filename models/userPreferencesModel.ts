import mongoose, { Model, Schema } from "mongoose";
import { IUserPreferences, Season } from "./types/userPreferences";
import { vacationSchema } from "./vacationModel";

export const userPreferencesSchema = new Schema(
  {
    userID: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      required: false,
    },
    climatePref: {
      type: [String],
      required: false,
    },
    dreamVacation: {
      type: vacationSchema,
      required: false,
    },
    favoriteVacation: {
      type: vacationSchema,
      required: false,
    },
    vacationStyle: {
      type: [String],
      required: false,
    },
    vacationType: {
      type: [String],
      required: false,
    },
    favVacationTimeOfYear:{
      type: String,
      enum: Object.values(Season),
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const UserPreferences = mongoose.models?.UserPreferences || mongoose.model("UserPreferences", userPreferencesSchema);

export default UserPreferences as Model<IUserPreferences>;