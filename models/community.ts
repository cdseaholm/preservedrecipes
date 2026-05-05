import mongoose, { Model, Schema } from "mongoose";
import { ICommunity } from "./types/community/community";

export const communitySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        adminIDs: {
            type: [String],
            default: [],
        },
        creatorID: {
            type: String,
            required: true,
        },
        communityMemberIDs: {
            type: [String],
            default: []
        },
        privacyLevel: {
            type: String,
            enum: ['public', 'private', 'hidden', 'restricted', 'passwordProtected'],
            default: 'public'
        },
        communityPassword: {
            type: String,
            required: false
        },
        tags: {
            type: [String],
            default: []
        },
        description: {
            type: String,
            required: false
        },
        postIDs: {
            type: [String],
            default: []
        },
        recipeIDs: {
            type: [String],
            default: []
        },
        requestIDs: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true,
    }
);

const Community = mongoose.models?.Community || mongoose.model("Community", communitySchema);

export default Community as Model<ICommunity>;
