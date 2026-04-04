export interface IUser {
  name: string;
  email: string;
  password: string;
  _id: string;
  userFamilyID: string;
  recipeIDs: string[];
  communityIDs: string[];
  //ratings will have to be the id of the post or recipe rated, or a mix of the rating and id
  //will need to change this in member-view too
  savedRecipeIDs: string[];
  createdAt: string;
  updatedAt: string;
  favoriteRecipeIDs: string[];
  resetPasswordToken: string;
  resetPasswordExpires: string;
}