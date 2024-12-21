import { IRecipe } from "./recipe";
import { IUserFamily } from "./userFamily";


export interface IUser {
  name: string;
  email: string;
  password: string;
  _id: string;
  userFamily: IUserFamily;
  recipes: IRecipe[];
  communityIDs: string[];
  ratings: number[];
  createdAt: string;
  updatedAt: string;
  resetPasswordToken: string;
  resetPasswordExpires: string;
}