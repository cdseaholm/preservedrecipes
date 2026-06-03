import mongoose, { Model, Schema } from "mongoose";
import { IInvite } from "./types/misc/invite";

export const inviteSchema = new Schema(
    {
        email: { 
            type: String, 
            required: true,
            trim: true,
            lowercase: true
        },
        inviteType: {
            type: String,
            enum: ['family', 'community'],
            default: 'family',
        },
        familyID: { 
            type: String, 
            required: false,
            default: '',
        },
        communityID: {
            type: String,
            required: false,
            default: '',
        },
        token: { 
            type: String, 
            required: true,
            unique: true
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
