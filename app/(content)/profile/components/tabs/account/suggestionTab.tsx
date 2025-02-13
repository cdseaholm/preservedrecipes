'use client'

import InSearchItemButton from "@/components/buttons/inSearchItemButton";
import SearchAndAdd from "@/components/misc/searchBox/searchAndAdd";
import { ISuggestion } from "@/models/types/suggestion";
import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { CheckFunction } from "../../../functions/functions";
import ViewSpecificItem from "../../profileHelpers/viewSpecificItem";
import { Session } from "next-auth";

export default function SuggestionTab({ suggestions, session }: { suggestions: ISuggestion[], session: Session | null }) {

    const [edit, setEdit] = useState(false);
    const [checkedAmt, setCheckedAmt] = useState(0);
    const [search, setSearch] = useState('');
    const [checked, setChecked] = useState<boolean[]>(new Array(suggestions.length).fill(false));

    const [itemToView, setItemToView] = useState<ISuggestion | null>(null)

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value)
    }

    const handleCreate = (_which: string, _open: boolean) => {
        toast.info('Handle create')
    }

    const handleChecked = (index: number) => {
        const checks = CheckFunction({ checked: checked, checkedAmt: checkedAmt, index: index }) as { newChecked: boolean[], newCheckedAmt: number }
        if (!checks) {
            toast.info('Error checking recipes')
            return;
        }
        setChecked(checks.newChecked);
        setCheckedAmt(checks.newCheckedAmt);
    };

    const handleEdit = () => {
        setEdit(!edit)
    }

    const handleOptions = () => {
        toast.info('Options')
    }

    const handleSeeItem = (index: number) => {
        if (index === -1) {
            setItemToView(null)
        } else {
            setItemToView(suggestions[index])
        }
    }

    const handleDelete = async () => {

        if (!session) {
            toast.info('Deleting failed')
            return;
        }

        toast.info('Deleting success')
        return;

        // const indicesToDelete = checked.map((isChecked, index) => isChecked ? index : -1).filter(index => index !== -1);

        // const itemsToDelete = indicesToDelete.map(index => userRecipes[index]);

        // const headers = { 'Authorization': `Bearer ${session.user}` };

        // const result = await AttemptDeleteRecipes({ toDelete: itemsToDelete }, headers);

        // if (result.status) {

        //     setEdit(false);
        //     setChecked(new Array(recipeTitles.length).fill(false));
        //     setCheckedAmt(0);

        // } else {

        //     toast.error(result.message);

        // }
    };

    return (
        itemToView ? (

            <ViewSpecificItem item={itemToView} handleSeeItem={handleSeeItem} parent={'suggestions'} />

        ) : (

            <div className="flex flex-col justify-evenly items-center w-full h-content divide-y divide-gray-400 space-y-2">
                <SearchAndAdd handleSearch={handleSearch} handleCreate={handleCreate} type={'Account'} additionString={''} searchString={'Search for suggestions'} index={2} handleEdit={handleEdit} edit={edit} totalSelected={checkedAmt} clickOptions={handleOptions} clickDelete={handleDelete} optionsLength={suggestions ? suggestions.length : 0}>
                    {
                        suggestions.length > 0 ? (
                            suggestions.filter((item) => item.suggestionTitle.toLowerCase().includes(search.toLowerCase().trim())).map((item, index) => (
                                <InSearchItemButton key={index} item={item.suggestionTitle} index={index} handleChecked={handleChecked} edit={edit} checked={checked[index]} handleSeeItem={handleSeeItem}>
                                    <ul className="space-x-2 text-ellipses" key={index}>{index + 1}. {item.suggestion}</ul>
                                </InSearchItemButton>
                            ))
                        ) : (
                            <ul className="p-2 text-start pl-7">{`Empty`}</ul>
                        )
                    }
                </SearchAndAdd>
            </div>
        )
    )
}