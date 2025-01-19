// 'use client'

// import ErrorPopover from "@/components/popovers/errorPopover";
// import { useStateStore } from "@/context/stateStore";
// import { errorType } from "@/models/types/error";
// import { Fieldset, Select, TextInput } from "@mantine/core";
// import { useForm, UseFormReturnType } from "@mantine/form";
// import { FamilyCreation } from "@/models/types/inAppCreations/familyCreation";
// import { MemberRelation, FamilyMember } from "@/models/types/familyMemberRelation";
// import { useState } from "react";
// import TextInsertComboBox from "@/components/misc/combobox/textInsertCombo";

// export default function FamilyMembersModal({ handleCancel, familyForm }: { handleCancel: () => void, familyForm: UseFormReturnType<FamilyCreation, (values: FamilyCreation) => FamilyCreation> }) {

//     const width = useStateStore(s => s.widthQuery);
//     const [errors, _setErrors] = useState<errorType[]>([] as errorType[]);
//     const [newMember, setNewMember] = useState<boolean>(false);
//     // const errorsExist = errors ? true : false;
//     // const errName = errorsExist && errors.find((err) => err.which === 'name') ? true : false;

//     const memberForm = useForm({
//         mode: 'uncontrolled',
//         initialValues: {
//             familyMemberID: '',
//             familyMemberName: '',
//             familyMemberEmail: '',
//             status: '',
//             relations: [] as MemberRelation[]
//         },
//         validate: {
//             familyMemberID: (_value) => null,
//             familyMemberName: (value) => (
//                 value ? (value.length > 100 ? 'Invalid name too long' : null) : 'Name cannot be empty'
//             ),
//             familyMemberEmail: (_value) => null,
//             status: (_value) => null,
//             relations: (_value) => null
//         }
//     });

//     const handleSaveMembers = () => {
//         if (newMember === true) {
//             const added = handleAddMembers();
//             if (added === false) {
//                 return;
//             }
//         }
//         handleCancel();
//     }

//     const handleAddMembers = () => {
//         const values = memberForm.getValues();
//         const memberToSave = { familyMemberName: values.familyMemberName, familyMemberEmail: values.familyMemberEmail, familyMemberID: values.familyMemberID, relations: values.relations, status: values.status } as FamilyMember
//         const validate = memberForm.validate();
//         if (validate.hasErrors) {
//             console.log(validate)
//             //setErrors(validate.errors)
//             return false;
//         }

//         let newMembers = [...familyForm.getValues().members, memberToSave]
//         familyForm.setFieldValue('members', newMembers);
//         setNewMember(false);
//         return true;
//     }

//     const handleRemoveMember = (index: number) => {
//         familyForm.removeListItem('members', index);
//     }

//     return (
//         <form id="membersModal" className="w-full h-full">
//             <Fieldset legend="Family Members" mah={600}>
//                 <div className="flex flex-row w-full justify-end items-center">
//                     <ErrorPopover errors={errors} width={width} />
//                 </div>
//                 <TextInsertComboBox form={familyForm} handleOpenMembers={() => handleRemoveMember} which="members" />
//                 <div className='grid grid-cols-1 grid-rows-3 gap-2 md:grid-cols-3 md:grid-rows-1 w-full'>
//                     <TextInput
//                         label={'Name'}
//                         placeholder='Name'
//                         id='newMemberName'
//                         name="newMemberName"
//                         withAsterisk
//                         key={memberForm.key('familyMemberName')}
//                         {...memberForm.getInputProps('familyMemberName')}
//                         error={memberForm.getInputProps('familyMemberName').error}
//                     />
//                     <TextInput
//                         label={'Email'}
//                         placeholder='Email'
//                         id='newMemberEmail'
//                         name='newMemberEmail'
//                         withAsterisk
//                         key={memberForm.key('familyMemberEmail')}
//                         {...memberForm.getInputProps('familyMemberEmail')}
//                         error={memberForm.getInputProps('familyMemberEmail').error}
//                     />
//                     <Select
//                         label="This member's site status"
//                         placeholder="Member"
//                         data={['Admin', 'Member', 'Guest']}
//                         id='newMemberStatus'
//                         name='newMemberStatus'
//                         withAsterisk
//                         key={memberForm.key('status')}
//                         {...memberForm.getInputProps('status')}
//                         error={memberForm.getInputProps('status').error}
//                     />
//                 </div>
//                 <div className='flex flex-row justify-evenly items-center w-full h-content p-1'>
//                     <button onClick={() => { setNewMember(true) }} className='w-content h-content p-2'>
//                         Add
//                     </button>
//                     <button onClick={() => setNewMember(false)} className='w-content h-content p-2'>
//                         Cancel
//                     </button>
//                 </div>
//             </Fieldset>
//             <section className="flex flex-row w-full justify-evenly items-center pt-16">
//                 <button type="button" onClick={handleCancel} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2 w-1/5">
//                     Cancel
//                 </button>
//                 <button type='button' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5" onClick={() => handleSaveMembers()}>
//                     Save
//                 </button>
//             </section>
//         </form>
//     )
// }