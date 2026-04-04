
import { IngredientForForm } from "./ingredient";
import { IReview } from "../misc/review";
import { IStep } from "./step";


export interface IRecipe {
    _id: string
    name: string;
    description: string;
    cookingTime: number;
    ingredients: IngredientForForm[];
    steps: IStep[];
    recipeType: string;
    tags: string[];
    image: string;
    //make sure when fetching recipes, if creatorID is empty, this suggests deleted user, add "Deleted User" as name
    creatorID: string;
    reviews: IReview[];
    recipeFor: ('personal' | 'family' | 'community')[];
    secret: boolean;
    secretViewerIDs: string[];
    favoriteCount: number;
    saveCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface RecipeFormContextType {
    type: 'create' | 'edit' | 'view' | '',
    recipe: IRecipe | null,
    from: 'personal' | 'family' | 'community' | 'post' | null,
    fromId: string | null
} 