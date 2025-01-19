import mongoose, { Model, Schema } from "mongoose";
import { recipeSchema } from "./recipe";
import { ICommunity } from "./types/community";
import { postSchema } from "./post";
import { permissionSchema } from "./permission";

export const communitySchema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        creatorIDs: {
            type: [String],
            required: false,
        },
        communityMemberIDs: {
            type: [permissionSchema],
            required: false
        },
        recipes: {
            type: [recipeSchema],
            required: false,
        },
        public: {
            type: Boolean,
            required: false
        },
        posts: {
            type: [postSchema],
            required: false
        }
    },
    {
        timestamps: true,
    }
);

const Community = mongoose.models?.Community || mongoose.model("Community", communitySchema);

export default Community as Model<ICommunity>;