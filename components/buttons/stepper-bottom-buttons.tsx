'use client'

import { RecipeStackType } from "@/models/types/recipes/review";
import { Button } from "@mantine/core"

export default function StepperBottomButtons({

    active,
    next,
    prev,
    handleStepChange,
    triggerCreateRecipe

}: {

    active: RecipeStackType,
    next: RecipeStackType,
    prev: RecipeStackType,
    handleStepChange: (toOpen: RecipeStackType) => void,
    triggerCreateRecipe: () => Promise<void>

}) {

    const handleClick = (toOpen: RecipeStackType) => {
        handleStepChange(toOpen);
    }

    return (
        <div className="flex flex-row justify-evenly items-center w-full my-4">
            <Button variant="outline" onClick={() => handleClick(prev)} className="w-3/5" disabled={active === "step-one"}>
                Prev
            </Button>
            {active === "step-five" ? (
                <Button variant="outline" onClick={triggerCreateRecipe} className="w-3/5">
                    Save
                </Button>
            ) : (
                <Button variant="outline" onClick={() => handleClick(next)} className="w-3/5">
                    Next
                </Button>
            )}
        </div>
    )
}