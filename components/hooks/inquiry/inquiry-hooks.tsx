'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { IInquiry, InquirySubmitFormType } from "@/models/types/misc/inquiry";
import { useUserStore } from "@/context/userStore";
import { Session } from "next-auth";
import { AttemptCreateInquiry } from "@/utils/apihelpers/create/create-inquiry";
import { AttemptEditInquiry } from "@/utils/apihelpers/edit/edit-inquiry";
import AttemptDeleteInquiry from "@/utils/apihelpers/delete/delete-inquiry";

export function useInquiryActions() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const storedInquiries = useUserStore(state => state.inquiries);
    const setInquiries = useUserStore(state => state.setInquiries);

    const validateSession = () => {

        if (!session) {
            toast.warning("You need to be signed in to make a inquiry!");
            return false;
        }

        const user = session.user;
        if (!user) {
            toast.error("There is an issue with your account, please try signing out and back in.");
            return false;
        }

        const email = user.email;
        if (!email) {
            toast.error("There is an issue with your account email, please try signing out and back in.");
            return false;
        }

        return true;
    };

    const createInquiry = async ({ inquiryForm, sessionPassed }: { inquiryForm: InquirySubmitFormType, sessionPassed: Session | null }) => {

        inquiryForm.clearErrors();

        try {

            if (!sessionPassed) {
                toast.warning("You need to be signed in to make a inquiry!");
                return false;
            }

            const user = sessionPassed.user;
            if (!user) {
                toast.error("There is an issue with your account, please try signing out and back in.");
                
                return false;
            }

            const email = user.email;
            if (!email) {
                toast.error("There is an issue with your account email, please try signing out and back in.");
                
                return false;
            }

            if (!inquiryForm) {
                toast.error("Something is wrong with your Inquiry information, please try again");
                
                return false;
            }

            const validate = inquiryForm.validate();

            if (validate.hasErrors) {
                console.log(validate.errors);
                console.log(validate);
                inquiryForm.setErrors(validate.errors);
                return false;
            }

            const madeTitle = inquiryForm.getValues().inquiryType + " " + new Date().toLocaleDateString();

            const inquiryToPass = {
                inquirerEmail: inquiryForm.getValues().inquirerEmail,
                inquirerName: inquiryForm.getValues().inquirerName,
                inquiryType: inquiryForm.getValues().inquiryType,
                inquiryMessage: inquiryForm.getValues().inquiryMessage,
                inquiryTitle: madeTitle,
                handled: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as IInquiry;

            let creationAttempt = await AttemptCreateInquiry({ inquiry: inquiryToPass, email: email }) as { status: boolean, message: string, returnedInquiry: IInquiry | null };

            if (!creationAttempt) {
                toast.error('Error creating inquiry');
                
                return false;
            }

            let attemptStatus = creationAttempt ? creationAttempt.status : false;

            if (!attemptStatus) {
                toast.error('Error creating inquiry');
                console.log(creationAttempt ? creationAttempt.message : 'Error with message');
                
                return false;
            }

            toast.success('Successfully created inquiry!');
            return true;

        } catch (error) {

            console.error('Error creating inquiry:', error);
            
            return false;

        }
    }

    const editInquiries = async (inquiriesToEdit: IInquiry[]) => {
        setLoading(true);
        try {
            if (!validateSession()) {
                setLoading(false);
                return { success: false };
            }

            if (!inquiriesToEdit || inquiriesToEdit.length === 0) {
                toast.info('No inquiries selected for editing');
                setLoading(false);
                return { success: false };
            }

            const editAttempt = await AttemptEditInquiry({ inquiriesToEdit });
            
            if (!editAttempt || editAttempt.status === false) {
                toast.error(`Error editing inquiries: ${editAttempt?.message || 'Unknown error'}`);
                setLoading(false);
                return { success: false };
            }

            // Update Zustand
            const updatedInquiries = storedInquiries.map(inq => {
                const found = inquiriesToEdit.find(s => s._id === inq._id);
                return found ? found : inq;
            });
            setInquiries(updatedInquiries);

            toast.success('Inquiries updated successfully');
            setLoading(false);
            return { success: true };

        } catch (error) {
            console.error('Error completing inquiries:', error);
            setLoading(false);
            return { success: false };
        }
    };

    const deleteInquiries = async (inquiriesToDelete: IInquiry[]) => {
        setLoading(true);
        try {
            if (!validateSession()) {
                setLoading(false);
                return { success: false };
            }

            if (inquiriesToDelete.length === 0) {
                toast.info('No inquiries selected for deletion');
                setLoading(false);
                return { success: false };
            }

            const deleteAttempt = await AttemptDeleteInquiry({ toDelete: inquiriesToDelete });
            
            if (!deleteAttempt || deleteAttempt.status === false) {
                toast.error(`Error deleting inquiries: ${deleteAttempt?.message || 'Unknown error'}`);
                setLoading(false);
                return { success: false };
            }

            // Update Zustand - remove deleted inquiries
            const idsToDelete = new Set(inquiriesToDelete.map(s => s._id));
            const updatedInquiries = storedInquiries.filter(inq => !idsToDelete.has(inq._id));
            setInquiries(updatedInquiries);

            toast.success('Inquiries deleted successfully');
            setLoading(false);
            return { success: true };

        } catch (error) {
            console.error('Error deleting inquiries:', error);
            setLoading(false);
            return { success: false };
        }
    };

    return {
        loading,
        editInquiries,
        deleteInquiries,
        createInquiry,
        storedInquiries
    };
}