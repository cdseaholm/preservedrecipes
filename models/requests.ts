import mongoose, { Model, Schema } from "mongoose";
import { IRequest } from "./types/misc/request";

export const requestSchema = new Schema(
    {
        requestFor: {
            type: {
                type: String,
                required: true,
            },
            id: {
                type: String,
                required: true,
            },
        },
        requesterID: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            required: true,
        }
    },
    {
        timestamps: true
    }
);

const Request = mongoose.models?.Request || mongoose.model("Request", requestSchema);

export default Request as Model<IRequest>;