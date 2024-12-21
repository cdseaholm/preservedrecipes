import mongoose, { Model, Schema } from "mongoose";
import { IUserFamily } from "./types/userFamily";

export const userFamilySchema = new Schema(
    {
        familyID: {
            type: String,
            default: ''
        },
        siblingIDs: {
            type: [String],
            default: []
        },
        parentIDs: {
            type: [String],
            default: []
        },
        childrenIDs: {
            type: [String],
            default: []
        },
        partnerIDs: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true,
    }
);

const UserFamily = mongoose.models?.UserFamily || mongoose.model("UserFamily", userFamilySchema);

export default UserFamily as Model<IUserFamily>;