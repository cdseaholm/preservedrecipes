export interface IUser {
  name: string;
  email: string;
  password: string;
  _id: string;
  userFamilyID: string;
  recipeIDs: string[];
  communityIDs: string[];
  ratings: number[];
  createdAt: string;
  updatedAt: string;
  resetPasswordToken: string;
  resetPasswordExpires: string;
}