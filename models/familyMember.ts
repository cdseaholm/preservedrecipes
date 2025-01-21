import mongoose, { Model, Schema } from "mongoose";
import { IFamilyMember } from "./types/familyMember";

export const familyMemberSchema = new Schema(
    {
        familyMemberID: {
            type: String,
            default: ''
        },
        familyMemberName: {
            type: String,
            default: ''
        },
        familyMemberEmail: {
            type: String,
            default: ''
        },
        permissionStatus: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
    }
);

const FamilyMember = mongoose.models?.FamilyMember || mongoose.model("FamilyMember", familyMemberSchema);

export default FamilyMember as Model<IFamilyMember>;