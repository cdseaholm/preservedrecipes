'use client'

import { Fieldset, Textarea, TextInput } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form";
import CancelButton from "../buttons/cancelButton";
import SubmitButton from "../buttons/submitButton";

export type SuggestionFormType = {
    title: string;
    suggestion: string;
}

export default function SuggestionForm({ handleCreateSuggestion, handleCancel }: { handleCreateSuggestion: ({ suggestionForm }: { suggestionForm: UseFormReturnType<SuggestionFormType, (values: SuggestionFormType) => SuggestionFormType> }) => void, handleCancel: () => void }) {

    const suggestionForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            suggestion: '',
        },
        validate: {
            title: (value) => (
                value ? (value.length > 100 ? 'Invalid title, too long' : null) : 'Title cannot be empty'
            ),
            suggestion: (value) => (
                value ? null : 'Suggestion cannot be empty'
            )
        }
    });

    return (
        <form id="modalSuggestionForm" className="w-full h-full" onAbort={() => { suggestionForm.reset(); suggestionForm.clearErrors(); handleCancel(); }} onSubmit={suggestionForm.onSubmit(() => handleCreateSuggestion({ suggestionForm }))}>
            <Fieldset legend="Suggestion Details" mah={600}>
                <TextInput
                    id="modalSuggestionTitle"
                    name="modalSuggestionTitle"
                    label="Suggestion Title"
                    placeholder="My best idea..."
                    mt={'md'}
                    withAsterisk
                    key={suggestionForm.key('title')}
                    {...suggestionForm.getInputProps('title')}
                    className="overflow-hidden whitespace-nowrap text-ellipsis pb-5"
                />
                <Textarea
                    id="modalSuggestionSuggestion"
                    name="modalSuggestionSuggestion"
                    label="Suggestion"
                    placeholder="I'd like to suggest..."
                    mt={'md'}
                    withAsterisk
                    key={suggestionForm.key('suggestion')}
                    {...suggestionForm.getInputProps('suggestion')}
                    className="overflow-hidden whitespace-nowrap text-ellipsis pb-5"
                />
            </Fieldset>
            <section className="flex flex-row w-full justify-evenly items-center pt-12 pb-8">
                <CancelButton handleCancel={() => { () => { suggestionForm.reset(); suggestionForm.clearErrors(); handleCancel(); } }} />
                <SubmitButton buttonTitle={'Create'} />
            </section>
        </form>
    )
}