'use client'

import InSearchItemButton from "@/components/buttons/inSearchItemButton"
import SearchAndAdd from "@/components/misc/searchBox/searchAndAdd"
import { ICommunity } from "@/models/types/community";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { CheckFunction } from "../../functions/functions";
import ViewSpecificItem from "../profileHelpers/viewSpecificItem";

export default function CommunityTab({ userCommunities, type, additionString, searchString, promoString }: { userCommunities: ICommunity[], type: string, additionString: string, searchString: string, promoString: string }) {

    const [edit, setEdit] = useState(false);
    const [checkedAmt, setCheckedAmt] = useState(0);
    const [communitySearch, setCommunitySearch] = useState('');
    const communityTitles = userCommunities ? userCommunities.map((com) => com.name) : [] as string[];
    const [checked, setChecked] = useState<boolean[]>(new Array(userCommunities.length).fill(false));
    const [itemToView, setItemToView] = useState<ICommunity | null>(null)

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setCommunitySearch(e.currentTarget.value)
    }

    const handleCreate = (_which: string, _open: boolean) => {
        return null;
    }

    const handleChecked = (index: number) => {
        const checks = CheckFunction({ checked: checked, checkedAmt: checkedAmt, index: index }) as { newChecked: boolean[], newCheckedAmt: number }
        if (!checks) {
            toast.info('Error checking recipes')
            return;
        }
        setChecked(checks.newChecked);
        setCheckedAmt(checks.newCheckedAmt);
    }

    const handleEdit = () => {
        setEdit(!edit)
    }

    const handleOptions = () => {
        toast.info('Options')
    }

    const handleDelete = () => {
        toast.info('Delete')
    }

    const handleSeeItem = (index: number) => {
        if (index === -1) {
            setItemToView(null)
        } else {
            setItemToView(userCommunities[index])
        }
    }

    return (
        itemToView ? (

            <ViewSpecificItem item={itemToView} handleSeeItem={handleSeeItem} parent={'communities'} />

        ) : (
            <SearchAndAdd handleSearch={handleSearch} handleCreate={handleCreate} type={type} additionString={additionString} searchString={searchString} index={3} handleEdit={handleEdit} edit={edit} totalSelected={checkedAmt} clickOptions={handleOptions} clickDelete={handleDelete} optionsLength={userCommunities.length}>
                {communityTitles.length > 0 ? (
                    communityTitles.filter((item) => item.toLowerCase().includes(communitySearch.toLowerCase().trim())).map((item, index) => (
                        <InSearchItemButton key={index} item={item} index={index} handleChecked={handleChecked} edit={edit} checked={checked[index]} handleSeeItem={handleSeeItem}>
                            <ul className="space-x-2">{index + 1}. {item}</ul>
                        </InSearchItemButton>
                    ))
                ) : (
                    <ul className="p-2 text-start pl-7">{`Join a ${promoString} to see it here`}</ul>
                )}
            </SearchAndAdd>
        )
    )
}