import mongoose, { Model, Schema } from "mongoose";
import { ICommunity } from "./types/community/community";

export const communitySchema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        adminIDs: {
            type: [String],
            required: false,
        },
        creatorID: {
            type: String,
            required: false,
        },
        communityMemberIDs: {
            type: [String],
            required: false
        },
        privacyLevel: {
            type: String,
            enum: ['public', 'private', 'hidden', 'restricted', 'passwordProtected'],
            required: false
        },
        communityPassword: {
            type: String,
            required: false
        },
        tags: {
            type: [String],
            required: false
        },
        description: {
            type: String,
            required: false
        },
        postIDs: {
            type: [String],
            required: false
        },
        recipeIDs: {
            type: [String],
            required: false
        },
        requestIDs: {
            type: [String],
            required: false
        }
    },
    {
        timestamps: true,
    }
);

const Community = mongoose.models?.Community || mongoose.model("Community", communitySchema);

export default Community as Model<ICommunity>;