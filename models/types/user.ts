import { IUserFamily } from "./userFamily";


export interface IUser {
  name: string;
  email: string;
  password: string;
  _id: string;
  userFamily: IUserFamily;
  recipeIDs: string[];
  communityIDs: string[];
  ratings: number[];
  createdAt: string;
  updatedAt: string;
  resetPasswordToken: string;
  resetPasswordExpires: string;
}