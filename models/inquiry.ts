import mongoose, { Model, Schema } from "mongoose";
import { IInquiry } from "./types/misc/inquiry";

export const inquirySchema = new Schema(
    {
        inquirerName: {
            type: String,
            required: true
        },
        inquirerEmail: {
            type: String,
            required: true
        },
        inquiryType: {
            type: String,
            enum: ['General', 'Bug Report', 'Feature Request', 'Suggestion', 'Other'],
            required: true
        },
        inquiryMessage: {
            type: String,
            required: true
        },
        inquiryTitle: {
            type: String,
            required: true
        },
        handled: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
    },
    {
        timestamps: true,
    }
);

const Inquiry = mongoose.models?.Inquiry || mongoose.model("Inquiry", inquirySchema);

export default Inquiry as Model<IInquiry>;