export type IStep = {
    relatedRecipeID?: string;
    stepId: number;
    IStep: string;
    description: string;
    ingredientIds: string[];
    image: string;
    stepAlternate: string[]
}