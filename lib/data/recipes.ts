import Ingredient from "@/models/ingredient";
import Recipe from "@/models/recipe";
import { IIngredient } from "@/models/types/recipes/ingredient";
import { IRecipe } from "@/models/types/recipes/recipe";
import { serializeDoc } from "@/utils/data/seralize";
import { ObjectId } from "mongodb";
import { cache } from "react";

export const getRecipesByIds = cache(async (ids: string[]): Promise<IRecipe[]> => {
    if (!ids.length) return [];
    const docs = await Recipe.find({ _id: { $in: ids.map(id => new ObjectId(id)) } }).lean();
    return docs.map(doc => serializeDoc<IRecipe>(doc));
})

export const getAllIngredients = cache(async (): Promise<IIngredient[]> => {
    const docs = await Ingredient.find({}).lean();
    return docs.map(doc => serializeDoc<IIngredient>(doc));
})