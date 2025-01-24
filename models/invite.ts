import mongoose, { Model, Schema } from "mongoose";
import { IInvite } from "./types/invite";

export const inviteSchema = new Schema(
    {
        email: { 
            type: String, 
            required: true 
        },
        familyID: { 
            type: String, 
            required: true 
        },
        token: { 
            type: String, 
            required: true 
        },
        createdAt: { 
            type: Date, 
            default: Date.now, expires: '7d' 
        },
    },
    {
        timestamps: true,
    }
);

const Invite = mongoose.models?.Invite || mongoose.model("Invite", inviteSchema);

export default Invite as Model<IInvite>;