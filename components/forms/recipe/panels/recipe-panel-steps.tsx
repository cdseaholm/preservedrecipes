'use client'

import { Fieldset, Menu, Textarea } from "@mantine/core";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { BiPencil, BiTrash } from "react-icons/bi";
import { RecipeFormType } from "@/models/types/recipes/review";
import { IStep } from "@/models/types/recipes/step";
import { useState } from "react";

export default function RecipePanelSteps({ recipeForm }: { recipeForm: RecipeFormType }) {

    const [editingStep, setEditingStep] = useState<number>(-1);

    return (
        <Fieldset variant="filled" className="flex flex-col justify-start items-center w-full h-full overflow-hidden" legend={<p className="text-base md:text-lg font-semibold mt-12">Recipe Steps</p>}>
            <button type="button" className="flex flex-row w-full justify-end items-center cursor-pointer" onClick={() => {
                const newStep = { stepId: recipeForm.getValues().steps.length, description: '' } as IStep;
                const updatedSteps = [...recipeForm.getValues().steps, newStep];
                recipeForm.setFieldValue('steps', updatedSteps);
            }}>+ Add Step</button>
            <div className="flex flex-col justify-start items-start w-full h-[50dvh] mt-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.10),inset_0_-2px_8px_rgba(0,0,0,0.10)] border border-accent/30 rounded-md scrollbar-thin scrollbar-webkit overflow-auto overflow-y-auto overflow-x-hidden">
                {recipeForm.getValues().steps && recipeForm.getValues().steps.length > 0 ? (
                    recipeForm.getValues().steps.map((step, index) => (
                        <div key={`step-${index}-${step.stepId}`} className="grid grid-cols-5 w-full p-2 items-center flex flex-row border-b border-accent/20 gap-2 pb-2 px-4 h-content">
                            <p className="text-xs sm:text-sm font-semibold span-cols-1">{`Step #${index + 1}:`}</p>
                            <div className="col-span-3 w-full h-content">
                                <Textarea
                                    className={`w-full text-xs sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis span-cols-3`}
                                    id={`modalStep-${index + 1}-description`}
                                    name={`modalStep-${index + 1}-description`}
                                    placeholder="Enter your descriptions here"
                                    key={recipeForm.key(`steps.${index}.description`)}
                                    {...recipeForm.getInputProps(`steps.${index}.description`)}
                                    minRows={editingStep === index ? 6 : 1}
                                />
                            </div>
                            <div className="col-span-1 flex flex-row justify-end items-center space-x-2">
                                <Menu shadow="md" width={200} closeOnClickOutside={true} closeOnItemClick={true}>
                                    <Menu.Target>
                                        <IoEllipsisHorizontal className="cursor-pointer" size={20} />
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Item leftSection={<BiPencil size={14} />} onClick={() => {
                                            setEditingStep(index);
                                        }}>
                                            Edit
                                        </Menu.Item>
                                        <Menu.Item leftSection={<BiTrash size={14} />} onClick={() => {
                                            const updatedSteps = recipeForm.getValues().steps.filter((_, i) => i !== index).map((step, i) => ({ ...step, stepId: i }));
                                            recipeForm.setFieldValue('steps', updatedSteps);
                                        }}>
                                            Delete
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </div>
                        </div>
                    ))
                ) : (
                    <div key={'no-steps-text'} className="flex flex-col justify-center items-center rounded-md px-2 py-1 mr-2 mb-2 w-full">
                        <p className="text-sm italic text-accent/70 text-center">{`No steps added yet. Click "Add Step" to begin.`}</p>
                        <p className="text-sm italic text-accent/70 text-center">{`At least one step is required`}</p>
                    </div>
                )}
            </div>
        </Fieldset>
    );
}