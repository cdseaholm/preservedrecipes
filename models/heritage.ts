import mongoose, { Model, Schema } from "mongoose";
import { HeritageType } from "./types/inAppCreations/heritage";

export const heritageSchema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        flagCode: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

const Heritage = mongoose.models?.Heritage || mongoose.model("Heritage", heritageSchema);

export default Heritage as Model<HeritageType>;