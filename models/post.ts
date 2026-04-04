import mongoose, { Model, Schema } from "mongoose";
import { IPost } from "./types/misc/post";

export const postSchema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            enum: ['recipe', 'text', 'image', 'video', 'link', 'other', null],
            required: false,
        },
        relatedToID: {
            type: String,
            required: false
        },
        relatedToType: {
            type: String,
            enum: ['recipe', 'family', 'community', null],
            required: false,
        },
        creatorID: {
            type: String,
            required: false
        },
        commentIDs: {
            type: [String],
            required: false
        },
        ratingsIDs: {
            type: [String],
            required: false
        },
        category: {
            type: [String],
            required: false
        },
        content: {
            type: [String],
            required: false
        }
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);

export default Post as Model<IPost>;