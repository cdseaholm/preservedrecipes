import { UseFormReturnType } from "@mantine/form";

export type ChangeNameType = {
    currName: string;
    name: string;
    namePassword: string;
}
export type ChangeEmailType = {
    currEmail: string;
    email: string;
    confirmEmail: string;
    emailPassword: string;
}
export type ChangePasswordType = {
    password: string;
    confirmPassword: string;
    newPassword: string;
}

export type ChangeNameFormType = UseFormReturnType<ChangeNameType, (values: ChangeNameType) => ChangeNameType>;

export type ChangeEmailFormType = UseFormReturnType<ChangeEmailType, (values: ChangeEmailType) => ChangeEmailType>;

export type ChangePasswordFormType = UseFormReturnType<ChangePasswordType, (values: ChangePasswordType) => ChangePasswordType>;

