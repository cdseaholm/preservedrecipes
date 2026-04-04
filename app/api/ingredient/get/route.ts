import Ingredient from "@/models/ingredient";
import { IIngredient } from "@/models/types/recipes/ingredient";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        const ingredients = await Ingredient.find().sort({ ingredient: 1 }).lean();
        if (!ingredients) {
            return NextResponse.json({ status: 404, ingredients: [] as IIngredient[] });
        }
        return NextResponse.json({ status: 200, ingredients: ingredients as IIngredient[] });
    } catch (error) {
        return NextResponse.json({ status: 500, ingredients: [] as IIngredient[] });
    }
}