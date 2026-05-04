'use client'

import { ActionIcon, Button, Textarea } from "@mantine/core";
import { BiPlus, BiTrash } from "react-icons/bi";
import { RecipeFormType } from "@/models/types/recipes/review";
import { IStep } from "@/models/types/recipes/step";

export default function RecipePanelSteps({ recipeForm }: { recipeForm: RecipeFormType }) {

    const addStep = () => {
        const newStep = { stepId: recipeForm.getValues().steps.length, description: '' } as IStep;
        const updatedSteps = [...recipeForm.getValues().steps, newStep];
        recipeForm.setFieldValue('steps', updatedSteps);
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-accent">Instructions</p>
                    <h3 className="text-xl font-semibold text-mainText">Write the instructions</h3>
                </div>
                <Button type="button" variant="light" leftSection={<BiPlus />} onClick={addStep}>
                    Add instruction
                </Button>
            </div>
            <div className="flex flex-col gap-3">
                {recipeForm.getValues().steps && recipeForm.getValues().steps.length > 0 ? (
                    recipeForm.getValues().steps.map((step, index) => (
                        <div key={`step-${index}-${step.stepId}`} className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-md border border-accent/15 bg-mainBack/70 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-lightText">
                                {index + 1}
                            </div>
                            <div className="min-w-0">
                                <Textarea
                                    className="w-full"
                                    id={`modalStep-${index + 1}-description`}
                                    name={`modalStep-${index + 1}-description`}
                                    placeholder="Describe this instruction"
                                    key={recipeForm.key(`steps.${index}.description`)}
                                    {...recipeForm.getInputProps(`steps.${index}.description`)}
                                    autosize
                                    minRows={2}
                                />
                            </div>
                            <ActionIcon
                                type="button"
                                variant="subtle"
                                color="red"
                                aria-label={`Delete instruction ${index + 1}`}
                                onClick={() => {
                                    const updatedSteps = recipeForm.getValues().steps.filter((_, i) => i !== index).map((step, i) => ({ ...step, stepId: i }));
                                    recipeForm.setFieldValue('steps', updatedSteps);
                                }}
                            >
                                <BiTrash />
                            </ActionIcon>
                        </div>
                    ))
                ) : (
                    <div key={'no-steps-text'} className="rounded-md border border-dashed border-accent/30 bg-mainBack/60 px-4 py-8 text-center">
                        <p className="text-sm font-medium text-mainText">No instructions yet</p>
                        <p className="text-sm text-mainText/60">Add at least one instruction so someone else can recreate it.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
