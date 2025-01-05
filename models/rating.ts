import mongoose, { Model, Schema } from "mongoose";
import { IRating } from "./types/rating";

export const ratingSchema = new Schema(
    {
        rating: {
            type: Number,
            required: false
        },
        raterID: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true,
    }
);

const Rating = mongoose.models?.Rating || mongoose.model("Rating", ratingSchema);

export default Rating as Model<IRating>;