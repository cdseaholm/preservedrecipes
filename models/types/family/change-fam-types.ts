import { UseFormReturnType } from "@mantine/form";
import { MemberStatusEditType } from "./familyMember";

export type ChangeFamNameType = {
    familyName: string;
    currAdminPassword: string;
}

export type ChangeFamNameFormType = UseFormReturnType<ChangeFamNameType, (values: ChangeFamNameType) => ChangeFamNameType>;

export type FamMemStatusFormType = {
    membersToEdit: MemberStatusEditType[];
    currAdminPassword: string;
}

export type ChangeFamilyMemberStatusFormType = UseFormReturnType<FamMemStatusFormType, (values: FamMemStatusFormType) => FamMemStatusFormType>;