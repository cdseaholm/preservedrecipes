'use client'

// import ErrorPopover from "@/components/popovers/errorPopover";
// import { Fieldset, TagsInput } from "@mantine/core";
// import { useStateStore } from "@/context/stateStore";
// import { errorType } from "@/models/types/error";
// import { UseFormReturnType } from "@mantine/form";
// import { RecipeFormType } from "../recipeForm";
// import ModalTemplate from "@/components/modals/templates/modalTemplate";
// import CancelButton from "@/components/buttons/cancelButton";
// import ActionButton from "@/components/buttons/basicActionButton";

// export default function RecipeViewers({ handleSaveAndCloseViewers, errors, form, handleCancelViewers }: { handleSaveAndCloseViewers: () => Promise<void>, errors: errorType[], form: RecipeFormType, handleCancelViewers: () => void }) {

//     const { width } = useWindowSizes();

//     const error = errors ? errors[0] : {} as errorType;
//     const errorWhich = error ? error.which as string : '';
//     const minWidth = width < 800 ? '80vw' : '60vw';

//     const save = async () => {
//         await handleSaveAndCloseViewers();
//     }

//     return (
//         <ModalTemplate subtitle={null} minHeight="15vh" minWidth={minWidth}>
//             <form id="modalAddViewers" className="w-full h-full">
//                 <Fieldset variant="unstyled" className="flex flex-col justify-center items-center w-full h-full border border-accent bg-altBack space-y-2" style={{ maxHeight: '90vh', overflow: 'hidden', borderRadius: '8px' }} radius={'sm'} px={'sm'} py={'sm'}>
//                     <div className="w-full scrollbar-thin scrollbar-webkit space-y-2 flex flex-col" style={{ maxHeight: '65vh', overflowY: 'auto', overflowX: 'hidden' }}>
//                         <Fieldset className={`flex flex-col justify-start space-y-1 items-center h-fit w-full`} key={'Recipe Viewers'}>
//                             <div className="flex flex-row w-full justify-between items-center">
//                                 <p className="text-xs sm:text-base text-black font-semibold">{`Recipe Viewers`}</p>
//                                 <ErrorPopover errors={errors} width={width} />
//                             </div>
//                             <TagsInput
//                                 className={`w-full text-xs sm:text-sm`}
//                                 id={`modalRecipeViewers`}
//                                 name={`modalRecipeViewers`}
//                                 placeholder="Enter an email here to add a secret recipe viewer"
//                                 key={form.key(`secretViewerIDs`)}
//                                 {...form.getInputProps(`secretViewerIDs`)}
//                                 error={errorWhich === 'viewers'}
//                             />
//                         </Fieldset>
//                     </div>
//                 </Fieldset>
//                 <section className="flex flex-row w-full justify-evenly items-center pt-5">
//                     <CancelButton handleCancel={() => handleCancelViewers()} />
//                     <ActionButton buttonTitle="Save" action={save} width="w-1/5" />
//                 </section>
//             </form>
//         </ModalTemplate>
//     )
// }

import { CheckIcon, Combobox, Group, Pill, PillsInput, Popover, useCombobox } from "@mantine/core";
import { useState } from "react";
import { useFamilyStore } from "@/context/familyStore";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { MyInfoIcon } from "@/components/popovers/infoPopover";
import { RecipeFormType } from "@/models/types/recipes/review";

export default function RecipeViewers({ recipeForm, width }: { recipeForm: RecipeFormType, width: number }) {

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const family = useFamilyStore(state => state.family);
    const [familyMembers, setFamilyMembers] = useState<IFamilyMember[]>(family ? family.familyMembers as IFamilyMember[] : [] as IFamilyMember[]);
    const [viewers, setViewers] = useState(recipeForm.getValues().secretViewerIDs || []);
    const [search, setSearch] = useState('');

    const exactOptionMatch = familyMembers && familyMembers.length > 1 && familyMembers.some((member) => member.familyMemberName === search || member.familyMemberEmail === search);
    const handleValueSelect = (val: string) => {
        setSearch('');

        if (val === '$create') {
            //may need to implement email validation and adding a family member to the tree here later
            const tempId = `temp-${familyMembers.length + 1}-${Date.now()}`;
            const newMember = {
                familyMemberID: tempId,
                familyMemberName: search,
                familyMemberEmail: search,
                permissionStatus: 'Guest',
                memberConnected: false
            } as IFamilyMember
            const updatedMembers = [...familyMembers, newMember];
            const updatedIds = [...viewers, tempId];
            setFamilyMembers(updatedMembers);
            setViewers(updatedIds);
            recipeForm.setFieldValue('secretViewerIDs', updatedIds);
        } else {
            setViewers((current) =>
                current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
            );

        }
    };

    const handleValueRemove = (val: string) => {
        setViewers((current) => current.filter((v) => v !== val));
        recipeForm.setFieldValue('secretViewerIDs', viewers.filter((v) => v !== val));
    }


    const values = viewers.map((item) => (
        <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {item}
        </Pill>
    ));

    const options = familyMembers && familyMembers.length > 1 && familyMembers
        .filter((item) => item.familyMemberEmail.toLowerCase().includes(search.trim().toLowerCase()) || item.familyMemberName.toLowerCase().includes(search.trim().toLowerCase()))
        .map((item) => (
            <Combobox.Option value={item.familyMemberID} key={item.familyMemberID} active={viewers.includes(item.familyMemberID)}>
                <Group gap="sm">
                    {viewers.includes(item.familyMemberID) ? <CheckIcon size={12} /> : null}
                    <span>{item.familyMemberName}</span>
                </Group>
            </Combobox.Option>
        ));

    return (
        <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
            <Combobox.DropdownTarget>
                <PillsInput onClick={() => combobox.openDropdown()}
                    mt={'md'}
                    label={
                        <div className="flex flex-row justify-end items-center w-full space-x-2">
                            <Popover width={'100%'} position='top-start' withArrow shadow-sm="md">
                                <Popover.Target>
                                    <div className='cursor-pointer flex flex-row justify-end items-center w-full h-full space-x-2'>
                                        <p className="w-content">Recipe Viewers</p>
                                        <div className="w-content">
                                            <MyInfoIcon title="" />
                                        </div>
                                    </div>
                                </Popover.Target>
                                <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }} w={width / 2}>
                                    <p className="pb-2">{`Since this recipe is set to private, these are individuals who can view the recipe. If the recipe is also set to "Family" and not "Personal" the recipe will be private to the family.`}</p>
                                    <p className="">{`Add the names or emails of the individuals by searching below. NOTE: They MUST be members of Preserved Recipes to be added here.`}</p>
                                </Popover.Dropdown>
                            </Popover>
                        </div>
                    }
                    labelProps={{ onClick: (e) => e.preventDefault() }}
                    w={'100%'}
                >
                    <Pill.Group>
                        {values}
                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                value={search}
                                placeholder="Search values"
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex();
                                    setSearch(event.currentTarget.value);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace' && search.length === 0 && viewers.length > 0) {
                                        event.preventDefault();
                                        handleValueRemove(viewers[viewers.length - 1]);
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>
            <Combobox.Dropdown>
                <Combobox.Options>
                    {options}
                    {!exactOptionMatch && search.trim().length > 0 && (
                        <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
                    )}
                    {exactOptionMatch && search.trim().length > 0 && options && options.length === 0 && (
                        <Combobox.Empty>Nothing found</Combobox.Empty>
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}