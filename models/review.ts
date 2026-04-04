import mongoose, { Model, Schema } from "mongoose";
import { IReview } from "./types/misc/review";

export const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      default: null,
    },
    authorId: {
      type: String,
        required: true,
    },
    authorFirstName: {
      type: String,
      default: 'Anonymous',
    },
    comment: {
      type: String,
      default: null,
    },
    commentLikes: {
      type: [Boolean],
        required: false,
    },
    inResponseToId: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.models?.Review || mongoose.model("Review", reviewSchema);

export default Review as Model<IReview>;