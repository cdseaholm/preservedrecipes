import mongoose, { Model, Schema } from "mongoose";
import { IVacation } from "./types/vacation";
import { activitySchema } from "./activityModel";

export const vacationSchema = new Schema(
  {
    userID: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false
    },
    dates: {
      type: Schema.Types.Mixed,
      required: false
    },
    location: {
      type: String,
      required: false,
    },
    vacationStatus: {
      type: String,
      required: false,
    },
    vacationClimate: {
      type: [String],
      required: false,
    },
    vacationActivities: {
      type: [activitySchema],
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
    vacationScore: {
      type: Number,
      required: false,
      default: -1,
    },
    vacayAIRating: {
      type: Number,
      required: false,
      default: -1,
    },
  },
  {
    timestamps: true,
  }
);

const Vacation = mongoose.models?.Vacation || mongoose.model("Vacation", vacationSchema);

export default Vacation as Model<IVacation>;