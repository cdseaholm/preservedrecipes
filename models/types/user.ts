import { IComment } from "./comment";
import { IRecipe } from "./recipe";


export interface IUser {
  name: string;
  email: string;
  password: string;
  _id: string;
  familyID: string;
  recipes: IRecipe[];
  comments: IComment[];
  communityIDs: string[];
  ratings: number[];
  siblingIDs: string[];
  parentIDs: string[];
  childrenIDs: string[];
  partnerIDs: string[];
  createdAt: string;
  updatedAt: string;
  resetPasswordToken: string;
  resetPasswordExpires: string;
}