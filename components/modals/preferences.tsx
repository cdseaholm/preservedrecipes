'use client'

import { Fieldset } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IUserPreferences, Season } from "@/models/types/userPreferences";
import { IVacation } from "@/models/types/vacation";
import PreferenceCurrents from "./initStatesForModals/preferenceCurrents";

export default function PreferencesModal({ form, previousVacations, handleCreate }: { form: UseFormReturnType<IUserPreferences, (values: IUserPreferences) => IUserPreferences>, previousVacations: IVacation[], handleCreate: (which: string) => void }) {


    const climatePref = form.values.climatePref as string[] || [];
    const vacationType = form.values.vacationType as string[] || [];
    const vacationStyle = form.values.vacationStyle as string[] || [];
    const favoriteVacation = form.values.favoriteVacation as IVacation || {} as IVacation;
    const favVacationString = favoriteVacation && favoriteVacation.location && favoriteVacation.dates ? [`${favoriteVacation.location}-${favoriteVacation.dates}`] : [];
    const dreamVacation = form.values.dreamVacation as IVacation || {} as IVacation;
    const dreamVacationString = dreamVacation && dreamVacation.location ? [`${dreamVacation.location}`] : [];
    const favVacationTimeOfYear = form.values.favVacationTimeOfYear !== undefined && form.values.favVacationTimeOfYear !== Season.Undefined ? [form.values.favVacationTimeOfYear] : [];
    const previousVacationStringArray = previousVacations && previousVacations.map((prevVacay: IVacation, _index: number) => {
        return prevVacay.name ? prevVacay.name : `${prevVacay.location}-${prevVacay.dates}`;
    })

    const climateData = [
        'Tropical',
        'Sunny',
        'Arid',
        'Humid',
        'Temperate',
        'Cold',
        'Dry',
        'Wet',
        'Windy',
        'Snowy',
        'Mild',
        'Hot',
        'Cool',
        'Rainy',
        'Foggy',
        'Stormy',
        'Breezy',
        'Icy',
        'Warm',
        'Chilly'
    ];

    const typeData = [
        'Touristy',
        'Educational',
        'Historical',
        'Cultural',
        'Relaxing',
        'Adventure',
        'Romantic',
        'Family',
        'Solo',
        'Group',
        'Nature',
        'Beach',
        'Mountain',
        'City',
        'Rural',
        'Wildlife',
        'Eco - friendly',
        'Luxury',
        'Budget',
        'Spiritual',

    ];

    const styleData = [
        'Cruises',
        'Luxurious',
        'Adventurous',
        'Backpacking',
        'Road Trip',
        'Camping',
        'Resort',
        'Spa',
        'Skiing',
        'Hiking',
        'Beachcombing',
        'City Exploration',
        'Culinary',
        'Festival',
        'Shopping',
        'Photography',
        'Wellness',
        'Yoga Retreat',
        'Safari',
        'Glamping',
    ];

    const seasons = [
        'Winter',
        'Spring',
        'Summer',
        'Autumn',
        'Leave empty'
    ];

    {/**
        let userClimatePref = [] as string[];
    let userVacationType = [] as string[];
    let userVacationStyle = [] as string[];
    let userFavoriteVacation = {} as IVacation;
    let userDreamVacation = {} as IVacation;
    let userFavVacationTimeOfYear = Season.Undefined as Season

    climatePref: userClimatePref,
            vacationType: userVacationType,
            vacationStyle: userVacationStyle,
            favoriteVacation: userFavoriteVacation,
            dreamVacation: userDreamVacation
        */}

    return (

        <Fieldset legend="Personal Vacation Preferences" className="space-y-5">

            <PreferenceCurrents subtitle="Favorite Vacation Climate" tagLine={climatePref} index={0} data={climateData} handleCreate={handleCreate} form={form} />
            <PreferenceCurrents subtitle="Favorite Vacation Type" tagLine={vacationType} index={1} data={typeData} handleCreate={handleCreate} form={form} />
            <PreferenceCurrents subtitle="Favorite Vacation Style" tagLine={vacationStyle} index={2} data={styleData} handleCreate={handleCreate} form={form} />
            <PreferenceCurrents subtitle="Favorite Vacation You've Had" tagLine={favVacationString} index={3} data={previousVacationStringArray} handleCreate={handleCreate} form={form} />
            <PreferenceCurrents subtitle="Dream Vacation" tagLine={dreamVacationString} index={4} data={previousVacationStringArray} handleCreate={handleCreate} form={form} />
            <PreferenceCurrents subtitle="Favorite Vacation Time of the Year" tagLine={favVacationTimeOfYear} index={5} data={seasons} handleCreate={handleCreate} form={form} />

        </Fieldset>

    )
}