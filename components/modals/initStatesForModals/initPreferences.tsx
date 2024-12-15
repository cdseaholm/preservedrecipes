'use client'

import { useModalStore } from "@/context/modalStore";
import { IUserPreferences, Season } from "@/models/types/userPreferences";
import { IVacation } from "@/models/types/vacation";
import { Modal, Popover, useModalsStack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { toast } from "sonner";
import PreferencesModal from "../preferences";
import { Session } from "next-auth";
import { useUserStore } from "@/context/userStore";
import { GoInfo } from "react-icons/go";
import { useEffect, useState } from "react";
import DreamVacationModal from "../templates/preferences/dreamVacay";
import FavVacationModal from "../templates/preferences/favVacay";

export default function InitPreferencesModal({ session, handleUpdate, userPreferences, openPreferencesModal }: { session: Session | null, handleUpdate: () => Promise<void>, userPreferences: IUserPreferences, openPreferencesModal: boolean }) {

    //global states
    const setOpenPreferencesModal = useModalStore(state => state.setOpenPreferencesModal);
    const previousVacations = useUserStore(state => state.vacations);
    const userID = useUserStore(state => state.userID);

    //local states
    const stack = useModalsStack(['main', 'fav', 'dream']);

    //local variables
    let userClimatePref = [] as string[];
    let userVacationType = [] as string[];
    let userVacationStyle = [] as string[];
    let userFavoriteVacation = {} as IVacation;
    let userDreamVacation = {} as IVacation;
    let userFavVacationTimeOfYear = Season.Undefined as Season;

    if (userPreferences) {
        userClimatePref = userPreferences.climatePref;
        userVacationStyle = userPreferences.vacationStyle;
        userVacationType = userPreferences.vacationType;
        userFavoriteVacation = userPreferences.favoriteVacation;
        userDreamVacation = userPreferences.dreamVacation;
        userFavVacationTimeOfYear = userPreferences.favVacationTimeOfYear;
    }

    const infoTitle = (
        <Popover
            width={200}
            position="bottom"
            withArrow
            shadow="md"
        >
            <Popover.Target>
                <span className="flex items-center cursor-pointer">
                    <GoInfo size={24} />
                </span>
            </Popover.Target>
            <Popover.Dropdown>
                Enter your vacation preferences to help your Vacay-AI Vacation planner help tailor vacation tips/recommendations to your liking.
            </Popover.Dropdown>
        </Popover>
    );

    //effects
    useEffect(() => {
        if (openPreferencesModal) {
            stack.open('main');
        } else {
            stack.closeAll();
        }
    }, [openPreferencesModal]);

    //form
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            climatePref: userClimatePref,
            vacationType: userVacationType,
            vacationStyle: userVacationStyle,
            favoriteVacation: userFavoriteVacation,
            dreamVacation: userDreamVacation,
            favVacationTimeOfYear: userFavVacationTimeOfYear
        } as IUserPreferences
    });

    //functions
    const handleSavePref = async (newPreferences: IUserPreferences) => {
        if (!session) {
            toast.error('You are already signed out');
            return;
        }

        const preferencesString = JSON.stringify(newPreferences, null, 2);
        toast.info(`These are your new preferences: ${preferencesString}`);

        // Uncomment the try-catch block if you want to handle the save operation
        // try {
        //     // const res = await SAVEPREF

        //     await handleUpdate();
        //     setOpenPreferencesModal(false);
        // } catch (error) {
        //     console.error('Error signing out:', error);
        // }

        form.reset();
        setOpenPreferencesModal(false);
        stack.closeAll();
    };

    const handleCancel = () => {
        setOpenPreferencesModal(false);
        stack.closeAll();
        toast.info("Cancelled Preferences");
    };

    const handleCreate = (which: string) => {
        if (which === 'fav') {
            stack.open('fav');
        } else {
            stack.open('dream');
        }
    };

    const handleSaveFavVacation = (vacation: IVacation) => {
        form.setFieldValue('favoriteVacation', vacation);
        stack.close('fav');
    };

    const handleSaveDreamVacation = (vacation: IVacation) => {
        form.setFieldValue('dreamVacation', vacation);
        stack.close('dream');
    };

    return (
        <Modal.Stack>
            <Modal centered size={'xl'} {...stack.register('main')} overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} title={infoTitle} onClose={handleCancel}>
                <main className="flex flex-col justify-evenly items-center space-y-12">
                    <form id="modalLoginForm" onSubmit={form.onSubmit((values) => handleSavePref(values))} onAbort={handleCancel} className="w-full">
                        <PreferencesModal form={form} previousVacations={previousVacations} handleCreate={handleCreate} />
                    </form>
                    <section className="flex flex-row w-full justify-evenly items-center">
                        <button onClick={() => handleCancel()} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2 w-1/5">
                            Cancel
                        </button>
                        <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5">
                            Save
                        </button>
                    </section>
                </main>
            </Modal>
            <Modal centered {...stack.register('fav')}>
                <FavVacationModal userID={userID} onSave={handleSaveFavVacation} />
            </Modal>
            <Modal centered {...stack.register('dream')}>
                <DreamVacationModal userID={userID} onSave={handleSaveDreamVacation} />
            </Modal>
        </Modal.Stack>
    );
}