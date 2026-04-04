import { UseFormReturnType } from "@mantine/form";

export interface IRequest {
    _id: string;
    requestFor: {
        type: string,
        id: string,
    };
    requesterID: string;
    message: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export interface IRequesterInfo {
    id: string;
    name: string;
    email: string;
    request: IRequest;
}

export type RequestSubmitFormType = UseFormReturnType<IRequesterInfo, (values: IRequesterInfo) => IRequesterInfo>;