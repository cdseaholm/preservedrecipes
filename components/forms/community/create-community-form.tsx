'use client'

import { Fieldset, MultiSelect, PasswordInput, Select, Textarea, TextInput } from "@mantine/core"
import CancelButton from "../../buttons/cancelButton";
import { CommunityFormType } from "@/models/types/community/community-form-type";
import { CommunityTags } from "@/components/misc/tags/community-tags";


export default function CreateCommunityForm({ handleCreateCommunity, handleCancel, communityForm }: { handleCreateCommunity: ({ communityForm }: { communityForm: CommunityFormType }) => void, handleCancel: () => void, communityForm: CommunityFormType }) {

    return (
        <form id="modalCreateCommunityForm" className="w-full h-full" onSubmit={communityForm.onSubmit(() => handleCreateCommunity({ communityForm }))} onAbort={handleCancel}>
            <Fieldset legend="Community Details" mah={600}>
                <TextInput
                    id="modalCommunityName"
                    name="modalCommunityName"
                    label="Community Name"
                    placeholder="Seaholm"
                    mt={'md'}
                    withAsterisk
                    key={communityForm.key('name')}
                    {...communityForm.getInputProps('name')}
                    error={communityForm.errors.name}
                    className="overflow-hidden whitespace-nowrap text-ellipsis pb-5"
                />
                <Textarea
                    id="modalCommunityDescription"
                    name="modalCommunityDescription"
                    label="Community Description"
                    placeholder="Fitness Group Recipes"
                    mt={'md'}
                    minRows={4}
                    key={communityForm.key('description')}
                    {...communityForm.getInputProps('description')}
                    error={communityForm.errors.description}
                />
                <Select
                    id="modalCommunityPrivacyLevel"
                    name="modalCommunityPrivacyLevel"
                    label="Community Privacy Level"
                    placeholder="Select Privacy Level"
                    mt={'md'}
                    data={[
                        { value: 'public', label: 'Public' },
                        { value: 'passwordProtected', label: 'Password Protected' },
                        { value: 'restricted', label: 'Restricted' },
                        { value: 'private', label: 'Private' },
                        { value: 'hidden', label: 'Hidden' },
                    ]}
                    key={communityForm.key('privacyLevel')}
                    {...communityForm.getInputProps('privacyLevel')}
                    error={communityForm.errors.privacyLevel}
                />
                {communityForm.getValues().privacyLevel !== 'public' &&
                    <PasswordInput
                        id="modalCommunityPassword"
                        name="modalCommunityPassword"
                        label={'Community Password'}
                        placeholder="If your community is private, enter a password here"
                        mt={'md'}
                        key={communityForm.key('communityPassword')}
                        {...communityForm.getInputProps('communityPassword')}
                        error={communityForm.errors.communityPassword}
                        disabled={communityForm.getValues().privacyLevel === 'public'}
                    />
                }
                <MultiSelect
                    id="modalCommunityTags"
                    name="modalCommunityTags"
                    label="Community Tags"
                    mt={'md'}
                    data={CommunityTags}
                    key={communityForm.key('tags')}
                    {...communityForm.getInputProps('tags')}
                />
                <div className="flex flex-row justify-center items-center w-full h-content px-2 py-7">
                    <p className="text-center text-gray-700">{`Once you have created the community here, you can add members or more admins from the community page.`}</p>
                </div>
            </Fieldset>
            <section className="flex flex-row w-full justify-evenly items-center pt-12 pb-8">
                <CancelButton handleCancel={handleCancel} />
                <button type='submit' className={`border border-neutral-200 rounded-md p-2 w-1/5 text-xs sm:text-sm ${communityForm.isDirty() ? 'hover:bg-blue-200 bg-blue-400 cursor-pointer' : 'bg-gray-200 cursor-not-allowed'}`} aria-label={'Create Community'} disabled={communityForm.isDirty() ? false : true}>
                    {'Create Community'}
                </button>
            </section>
        </form>
    )
}