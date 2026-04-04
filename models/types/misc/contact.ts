import { UseFormReturnType } from "@mantine/form";

export type IContact = {
    _id: string;
    contactEmail: string;
    contactName: string;
    contactMessage: string;
    typeOfInquiry: 'General' | 'Bug Report' | 'Feature Request' | 'Suggestion' | 'Other';
    handled: boolean;
    createdAt: Date;
    updatedAt: Date;
    title: string;
}

export type ContactFormType = {
    id: string;
    title: string;
    typeOfInquiry: 'General' | 'Bug Report' | 'Feature Request' | 'Suggestion' | 'Other';
    contactMessage: string;
    contactEmail: string;
    contactName: string;
    handled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type ContactSubmitForm = UseFormReturnType<ContactFormType, (values: ContactFormType) => ContactFormType>;