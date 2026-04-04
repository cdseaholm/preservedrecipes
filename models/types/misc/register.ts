import { UseFormReturnType } from "@mantine/form";

export type RegisterType = {

    name: string;
    email: string;
    password: string;
    confirmPassword: string;

}

export type RegisterFormType = UseFormReturnType<RegisterType, (values: RegisterType) => RegisterType>;