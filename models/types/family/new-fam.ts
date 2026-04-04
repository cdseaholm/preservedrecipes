import { UseFormReturnType } from "@mantine/form";

export type NewMembers = {
    email: string;
    permissions: string;
}

export type NewFamMemFormType = {
    newMembers: NewMembers[];
}

export type NewFamilyMemberFormType = UseFormReturnType<NewFamMemFormType, (values: NewFamMemFormType) => NewFamMemFormType>;