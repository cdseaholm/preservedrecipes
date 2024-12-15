import mongoose, { Model, Schema } from "mongoose";
import { IActivity } from "./types/activity";

export const activitySchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    activityName: {
      type: String,
      required: true,
    },
    activityStatus: {
      type: String,
      required: true,
    },
    activityType: {
      type: [String],
      required: true,
    },
    activityRatingOfTen: {
      type: Number,
      required: true,
      default: -1,
    },
    usedVacayAI: {
      type: Boolean,
      required: true,
      default: false,
    },
    activityDifficultyOfTen: {
      type: Number,
      required: true,
      default: -1,
    },
    activityRepeatabilityOfTen: {
      type: Number,
      required: true,
      default: -1,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.models?.Activity || mongoose.model("Activity", activitySchema);

export default Activity as Model<IActivity>;