import mongoose, { Model, Schema } from "mongoose";
import { IPermissions } from "./types/permission";

export const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    id: {
        type: String,
        required: false,
    },
    permissionStatus: {
        type: String,
        required: false
    }
  },
  {
    timestamps: true,
  }
);

const Permission = mongoose.models?.Permission || mongoose.model("Permission", permissionSchema);

export default Permission as Model<IPermissions>;