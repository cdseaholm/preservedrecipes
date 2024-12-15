'use client'

import { IUserPreferences } from "@/models/types/userPreferences";
import { Button, Select, TagsInput, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export default function PreferenceCurrents({ subtitle, tagLine, data, index, handleCreate, form }: { subtitle: string, tagLine: string[], index: number, data: string[], handleCreate: (which: string) => void, form: UseFormReturnType<IUserPreferences, (values: IUserPreferences) => IUserPreferences> }) {

    return (
        <div className="flex flex-col h-full w-full justify-center">
            <label className="text-xs text-gray-700">
                {subtitle}
            </label>
            {index === 0 || index === 1 || index === 2 ? (
                <div className="flex flex-col w-full h-full">
                    <TagsInput
                        id={index === 0 ? 'modalClimate' : index === 1 ? 'modalType' : 'modalStyle'}
                        name={index === 0 ? 'modalClimate' : index === 1 ? 'modalType' : 'modalStyle'}
                        placeholder={!tagLine || tagLine.length <= 0 ? 'Empty' : undefined}
                        defaultValue={tagLine}
                        splitChars={[',', '']}
                        data={data}
                        clearable
                        key={form.key(index === 0 ? 'climatePref' : index === 1 ? 'vacationType' : 'vacationStyle')}
                        {...form.getInputProps(index === 0 ? 'climatePref' : index === 1 ? 'vacationType' : 'vacationStyle')}
                    />
                </div>
            ) : index === 5 ? (
                <div className="flex flex-col w-full h-full">
                    <Select
                        id="modalSeason"
                        name="modalSeason"
                        placeholder={!tagLine || tagLine.length <= 0 ? 'Empty' : undefined}
                        data={data}
                        key={form.key('favVacationTimeOfYear')}
                        {...form.getInputProps('favVacationTimeOfYear')}
                    />
                </div>
            ) : (
                <DreamAndFavSection data={data} tagLine={tagLine} handleCreate={handleCreate} which={index === 3 ? 'fav' : 'dream'} form={form} />
            )}
        </div>
    )
}

export function DreamAndFavSection({ data, tagLine, handleCreate, which, form }: { data: string[], tagLine: string[], handleCreate: (which: string) => void, which: string, form: UseFormReturnType<IUserPreferences, (values: IUserPreferences) => IUserPreferences> }) {
    return (
        <div className="flex flex-row w-full h-full items-center space-x-2">
            <div className="flex flex-col w-3/4 md:w-4/5 justify-center">
                {data && data.length <= 0 ? (
                    <Select
                        id={which === 'fav' ? 'modalFav' : 'modalDream'}
                        name={which === 'fav' ? 'modalFav' : 'modalDream'}
                        placeholder={!tagLine || tagLine.length <= 0 ? 'Select from previous vacations' : undefined}
                        data={data}
                        key={form.key(which === 'fav' ? 'favoriteVacation' : 'dreamVacation')}
                        {...form.getInputProps((which === 'fav' ? 'favoriteVacation' : 'dreamVacation'))}
                    />
                ) : (
                    <TextInput
                        placeholder={!tagLine || tagLine.length <= 0 ? 'Select from previous vacations' : undefined}
                        disabled
                    />
                )}
            </div>
            <div className="flex flex-col w-1/4 md:w-1/5 justify-center">
                <Button variant='' color="rgba(237, 207, 161, 1)" size="xs" className="h-full" onClick={() => handleCreate(which)}>
                    Create
                </Button>
            </div>
        </div>
    )
}