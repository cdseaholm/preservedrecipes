'use client'

import ChangeFamNameForm from "@/components/forms/family/change-fam-name-form";
import ChangeFamMemberStatus from "@/components/forms/family/changeFamMemberStatus";
import { ChangeFamilyMemberStatusFormType, ChangeFamNameFormType } from "@/models/types/family/change-fam-types";
import { Fieldset, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";

export default function ConfirmHook() {

    const confirmWithPassword = ({ passedConfirmFunction, passedForm }: {
        passedConfirmFunction: any, passedForm: any
    }) => modals.openConfirmModal({
        title: `Enter your password to confirm this change`,
        children: (
            <Fieldset legend={'To save, enter your password, then click confirm'}>
                <div className="flex flex-row w-full justify-evenly h-content items-end">
                    <TextInput
                        id={'adminConfirmPW'}
                        name={'adminConfirmPW'}
                        label={'Password'}
                        placeholder={'123Password'}
                        mt={'md'}
                        withAsterisk
                        key={passedForm.key('currAdminPassword')}
                        {...passedForm.getInputProps('currAdminPassword')}
                    />
                </div>
            </Fieldset>
        ),
        labels: { confirm: 'Confirm', cancel: 'Back' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => passedConfirmFunction({ passedForm })
    });

    const changeFamName = (changeFamNameForm: ChangeFamNameFormType, submitChange: () => void) => modals.openConfirmModal({
        title: `Enter the change in the family name, then when you're ready click confirm`,
        children: (
            <ChangeFamNameForm changeFormToUse={changeFamNameForm} />
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => confirmWithPassword({ passedConfirmFunction: submitChange, passedForm: changeFamNameForm })
    });

    const changeFamMemStatus = (editFamMemStatusForm: ChangeFamilyMemberStatusFormType, handleChangeStatuses: () => void) => modals.openConfirmModal({
        title: `Choose which member to edit, their new status, then when you're ready click confirm`,
        children: (
            <ChangeFamMemberStatus editFamMemStatus={editFamMemStatusForm} />
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => editFamMemStatusForm.reset(),
        onConfirm: () => confirmWithPassword({ passedConfirmFunction: handleChangeStatuses, passedForm: editFamMemStatusForm })
    });

    return { confirmWithPassword, changeFamName, changeFamMemStatus };
}