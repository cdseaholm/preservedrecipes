import mongoose, { Model, Schema } from "mongoose";
import { IFamily } from "./types/family";
import { recipeSchema } from "./recipe";
import { permissionSchema } from "./permission";
import { heritageSchema } from "./heritage";

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
        recipes: {
            type: [recipeSchema],
            required: false,
        },
        familyMemberIDs: {
            type: [permissionSchema],
            required: false
        }
    },
    {
        timestamps: true,
    }
);

const Family = mongoose.models?.Family || mongoose.model("Family", familySchema);

export default Family as Model<IFamily>;