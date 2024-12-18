import mongoose, { Model, Schema } from "mongoose";
import { IPost } from "./types/post";
import { commentSchema } from "./comment";

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
        creatorID: {
            type: String,
            required: false
        },
        comments: {
            type: [commentSchema],
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