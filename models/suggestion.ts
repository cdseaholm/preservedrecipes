import mongoose, { Model, Schema } from "mongoose";
import { ISuggestion } from "./types/suggestion";

export const suggestionSchema = new Schema(
    {
        suggestorName: {
            type: String,
            required: true
        },
        suggestorEmail: {
            type: String,
            required: true
        },
        suggestion: {
            type: String,
            required: true
        },
        handled: {
            type: String,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now, expires: '7d'
        },
        suggestionTitle: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
    }
);

const Suggestion = mongoose.models?.Suggestion || mongoose.model("Suggestion", suggestionSchema);

export default Suggestion as Model<ISuggestion>;