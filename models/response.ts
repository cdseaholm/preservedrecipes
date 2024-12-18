import mongoose, { Model, Schema } from "mongoose";
import { IResponse } from "./types/response";

export const responseSchema = new Schema(
  {
    responserID: {
        type: String,
        required: false,
    },
    response: {
        type: String,
        required: false
    },
    responseLikes: {
        type: [Boolean],
        required: false
    }
  },
  {
    timestamps: true,
  }
);

const Response = mongoose.models?.Response || mongoose.model("Response", responseSchema);

export default Response as Model<IResponse>;