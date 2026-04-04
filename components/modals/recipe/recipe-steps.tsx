'use client'

import { OpenIcon } from "@/components/misc/icons/icon";
import { RecipeFormStepState, RecipeStackType } from "@/models/types/recipes/review";
import { Modal, Stepper } from "@mantine/core"
import { IconCheck, IconX } from '@tabler/icons-react';


export default function RecipeStepsModalNav({ opened, active, handleStepChange, handleToggleStepsNav, stepperStates }: { opened: boolean, active: number, handleStepChange: (step: RecipeStackType) => void, handleToggleStepsNav: () => void, stepperStates: { state: RecipeFormStepState, color: string }[] }) {

    const setNewActive = (stepIndex: number) => {
        console.log("Step index:", stepIndex);
        switch (stepIndex) {
            case 0:
                handleStepChange("step-one");
                break;
            case 1:
                handleStepChange("step-two");
                break;
            case 2:
                handleStepChange("step-three");
                break;
            case 3:
                handleStepChange("step-four");
                break;
            case 4:
                handleStepChange("step-five");
                break;
            default:
                break;
        }
    }

    const getStepIcon = (state: RecipeFormStepState, stepIndex: number) => {
        if (stepIndex === active) {
            return <OpenIcon />;
        }
        if (state === 'completed' && stepIndex !== 4) {
            return <IconCheck />;
        }
        if (state === 'errors') {
            return <IconX />;
        }
        // Untouched or opened but not current - no icon
        return null;
    }

    return (
        <Modal
            opened={opened}
            onClose={handleToggleStepsNav}
            title="Recipe Creation Steps"
            centered
            overlayProps={{
                backgroundOpacity: 0.75,
                blur: 3,
                className: 'drop-shadow-xl'
            }}
            size={'auto'}
            transitionProps={{ transition: 'pop' }}
            zIndex={1001}
            closeOnClickOutside={true}
        >
            <Stepper active={active} onStepClick={(stepIndex) => setNewActive(stepIndex)} orientation={'vertical'}>
                <Stepper.Step 
                    label="Defining" 
                    description="Define your Recipe"
                    color={stepperStates[0].color} 
                    icon={getStepIcon(stepperStates[0].state, 0)}
                    completedIcon={stepperStates[0].state === 'errors' ? <IconX size={16} /> : <IconCheck size={16} />}
                />
                <Stepper.Step 
                    label="Ingredients" 
                    description="Add Ingredients" 
                    color={stepperStates[1].color} 
                    icon={getStepIcon(stepperStates[1].state, 1)}
                    completedIcon={stepperStates[1].state === 'errors' ? <IconX size={16} /> : <IconCheck size={16} />}
                />
                <Stepper.Step 
                    label="Recipe Steps" 
                    description="List Steps" 
                    color={stepperStates[2].color} 
                    icon={getStepIcon(stepperStates[2].state, 2)}
                    completedIcon={stepperStates[2].state === 'errors' ? <IconX size={16} /> : <IconCheck size={16} />}
                />
                <Stepper.Step 
                    label="Extras" 
                    description="Add Tags and Settings" 
                    color={stepperStates[3].color} 
                    icon={getStepIcon(stepperStates[3].state, 3)}
                    completedIcon={stepperStates[3].state === 'errors' ? <IconX size={16} /> : <IconCheck size={16} />}
                />
                <Stepper.Step 
                    label="Review and Save" 
                    description="Save Recipe" 
                    color={stepperStates[4].color} 
                    icon={getStepIcon(stepperStates[4].state, 4)}
                    completedIcon={stepperStates[4].state === 'errors' ? <IconX size={16} /> : <IconCheck size={16} />}
                />
                <Stepper.Completed>
                    Recipe is saved and ready to view!
                </Stepper.Completed>
            </Stepper>
        </Modal>
    );
}