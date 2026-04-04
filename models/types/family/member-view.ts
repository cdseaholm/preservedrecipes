
import { ICommunity } from "../community/community";
import { IReview } from "../misc/review";
import { IRecipe } from "../recipes/recipe";
import { IFamily } from "./family";

export interface IUserView {
    familyMemberID: string;
    familyMemberName: string;
    familyMemberEmail: string;
    publicRecipes: IRecipe[];
    publicReviews: IReview[];
    publicCommunities: ICommunity[];
    overlappingCommunities: ICommunity[] | null;
    sameFamily: IFamily | null;
}