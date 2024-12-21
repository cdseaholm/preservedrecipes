import mongoose, { Model, Schema } from "mongoose";
import { responseSchema } from "./response";
import { IComment } from "./types/comment";

export const commentSchema = new Schema(
  {
    commentorID: {
      type: String,
      required: false,
    },
    comment: {
        type: String,
        required: false,
    },
    responses: {
        type: [responseSchema],
        required: false
    },
    commentLikes: {
        type: [Boolean],
        required: false
    }
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.models?.Comment || mongoose.model("Comment", commentSchema);

export default Comment as Model<IComment>;