import mongoose, { Model, Schema } from "mongoose";
import { IFamily } from "./types/family/family";
import { heritageSchema } from "./heritage";
import { familyMemberSchema } from "./familyMember";

export const familySchema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        heritage: {
            type: [heritageSchema],
            required: false,
        },
        recipeIDs: {
            type: [String],
            required: false,
        },
        familyMembers: {
            type: [familyMemberSchema],
            required: false
        }
    },
    {
        timestamps: true,
    }
);

const Family = mongoose.models?.Family || mongoose.model("Family", familySchema);

export default Family as Model<IFamily>;