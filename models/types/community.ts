import { IPermissions } from "./permission";
import { IPost } from "./post";
import { IRecipe } from "./recipe";

export interface ICommunity {
    name: string;
    _id: string;
    creatorIDs: IPermissions[];
    recipes: IRecipe[];
    communityMemberIDs: string[];
    public: boolean;
    posts: IPost[]
}