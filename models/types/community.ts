import { IPost } from "./post";
import { IRecipe } from "./recipe";

export interface ICommunity {
    name: string;
    _id: string;
    creatorIDs: string[];
    recipes: IRecipe[];
    communityMemberIDs: string[];
    public: boolean;
    posts: IPost[]
}