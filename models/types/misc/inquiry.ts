import { UseFormReturnType } from "@mantine/form";

export type IInquiry = {
    _id: string;
    inquirerEmail: string;
    inquirerName: string;
    inquiryType: 'General' | 'Bug Report' | 'Feature Request' | 'Suggestion' | 'Other';
    inquiryMessage: string;
    inquiryTitle: string;
    handled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type InquiryFormType = {
    id: string;
    inquirerEmail: string;
    inquirerName: string;
    inquiryType: 'General' | 'Bug Report' | 'Feature Request' | 'Suggestion' | 'Other' | '';
    inquiryMessage: string;
    inquiryTitle: string;
    handled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type InquirySubmitFormType = UseFormReturnType<InquiryFormType, (values: InquiryFormType) => InquiryFormType>;