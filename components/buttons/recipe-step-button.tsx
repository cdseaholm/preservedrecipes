'use client'

import { Button } from "@mantine/core"

export default function RecipeStepsButton({ active, handleSteps }: { active: number, handleSteps: () => void }) {
    return (
        <Button variant="default" onClick={handleSteps}>
            Step {active} of 5
        </Button>
    )
}