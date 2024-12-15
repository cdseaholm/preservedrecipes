'use client'

import { IActivity } from "@/models/types/activity";
import { IVacation } from "@/models/types/vacation";
import { Fieldset, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function DreamVacationModal({ onSave, userID }: { onSave: (vacation: IVacation) => void, userID: string }) {
    const localForm = useForm({
        initialValues: {
            userID: userID as string,
            name: 'New Fav Vacay',
            vacationActivities: [] as IActivity[],
            vacationScore: -1,
            vacationStyle: [] as string[],
            vacationType: [] as string[],
            vacayAIRating: -1,
            vacationClimate: [] as string[],
            vacationStatus: '',
            location: '',
            dates: {} as Date | {
                start: Date;
                end: Date;
            }
        } as IVacation
    });

    const handleSave = () => {
        onSave(localForm.values);
    };

    return (
        <main className="flex flex-col justify-evenly items-center space-y-12">
            <Fieldset legend="Dream Vacation" className="space-y-5">
                <TextInput label="Location" {...localForm.getInputProps('location')} />
                <TextInput label="Dates" {...localForm.getInputProps('dates')} />
                <TextInput label="Vacation Style" {...localForm.getInputProps('vacationStyle')} />
                <TextInput label="Vacation Type" {...localForm.getInputProps('vacationType')} />
                <TextInput label="Vacation Climate" {...localForm.getInputProps('vacationClimate')} />
                <TextInput label="Vacation Status" {...localForm.getInputProps('vacationStatus')} />
                <TextInput label="Vacation Score" type="number" {...localForm.getInputProps('vacationScore')} />
                <TextInput label="Vacay AI Rating" type="number" {...localForm.getInputProps('vacayAIRating')} />
                <Button onClick={handleSave}>Save</Button>
            </Fieldset>
        </main>
    );
}