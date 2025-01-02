import { errorType } from "@/models/types/error";
import { IngredientType } from "@/models/types/ingredientType";
import { StepType } from "@/models/types/stepType";

export async function ValidateIngredients(ingredient: IngredientType, index: number) {
    const errors = [] as errorType[]
    if (!ingredient.ingredient) {
        errors.push({ index: index, which: 'ingredient', message: `Ingredient #${index + 1} name can't be empty` });
    }
    if (!ingredient.quantity) {
        errors.push({ index: index, which: 'quantity', message: `Ingredient #${index + 1} quantity amount can't be empty` });
    }
    if (!ingredient.quantityType) {
        errors.push({ index: index, which: 'type', message: `Ingredient #${index + 1} quantity type can't be empty` });
    }
    return errors;
};

export async function ValidateSteps(step: StepType, index: number) {
    const errors = [] as errorType[];
    if (!step.description || step.description === '') {
        errors.push({ index: index, which: 'description', message: `Step #${index + 1} description must give some direction` });
    }
    return errors;
};

export async function ValidateNameAndDescription(name: string, description: string) {
    const errors = [] as errorType[];
    if (name.length > 150) {
        errors.push({index: 0, which: 'name', message: `Name is too long. Keep it within 150 characters.`})
    }
    if (description.length > 1000) {
        errors.push({index: 1, which: 'description', message: `Description is too long. Keep it within 1000 characters.`})
    }
    if (!name || name.length === 0) {
        errors.push({index: 0, which: 'name', message: `Name cannot be empty`});
    }
    if (!description || description.length === 0) {
        errors.push({index: 1, which: 'description', message: `Description of this recipe cannot be empty.`})
    }
}