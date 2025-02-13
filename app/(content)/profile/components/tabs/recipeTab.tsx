'use client'

import InSearchItemButton from "@/components/buttons/inSearchItemButton";
import SearchAndAdd from "@/components/misc/searchBox/searchAndAdd"
import { useModalStore } from "@/context/modalStore";
import { IRecipe } from "@/models/types/recipe";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckFunction } from "../../functions/functions";
import AttemptDeleteRecipes from "@/utils/apihelpers/delete/deleteRecipe";
import { Session } from "next-auth";
import ViewSpecificItem from "../profileHelpers/viewSpecificItem";

export default function RecipeTab({ userRecipes, type, additionString, searchString, promoString, session }: { userRecipes: IRecipe[], type: string, additionString: string, searchString: string, promoString: string, session: Session | null }) {

    const [edit, setEdit] = useState(false);
    const [checkedAmt, setCheckedAmt] = useState(0);
    const setOpenCreateRecipeModal = useModalStore(state => state.setOpenCreateRecipeModal);
    const [recipeSearch, setRecipeSearch] = useState('');
    const [recipeTitles, setRecipeTitles] = useState<string[]>([] as string[])
    const [checked, setChecked] = useState<boolean[]>(new Array(userRecipes.length).fill(false));
    const [itemToView, setItemToView] = useState<IRecipe | null>(null)


    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setRecipeSearch(e.currentTarget.value)
    }

    const handleCreate = (_which: string, open: boolean) => {
        setOpenCreateRecipeModal(open);
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
            setItemToView(userRecipes[index])
        }
    }

    const handleDelete = async () => {

        if (!session) {
            return;
        }

        const indicesToDelete = checked.map((isChecked, index) => isChecked ? index : -1).filter(index => index !== -1);

        const itemsToDelete = indicesToDelete.map(index => userRecipes[index]);

        const headers = { 'Authorization': `Bearer ${session.user}` };

        const result = await AttemptDeleteRecipes({ toDelete: itemsToDelete }, headers);

        if (result.status) {

            setEdit(false);
            setChecked(new Array(recipeTitles.length).fill(false));
            setCheckedAmt(0);

        } else {

            toast.error(result.message);

        }
    };

    //length of recipe titles is error

    useEffect(() => {
        if (!userRecipes) {
            console.log('Recipe error');
            return;
        }
        const lengthOfRecipes = userRecipes.length;
        setRecipeTitles(userRecipes.filter(rec => rec).map((rec) => rec.name))
        setChecked(new Array(lengthOfRecipes).fill(false));
    }, [userRecipes])

    return (
        itemToView ? (

            <ViewSpecificItem item={itemToView} handleSeeItem={handleSeeItem} parent={'suggestions'} />

        ) : (
            <SearchAndAdd handleSearch={handleSearch} handleCreate={handleCreate} type={type} additionString={additionString} searchString={searchString} index={2} handleEdit={handleEdit} edit={edit} totalSelected={checkedAmt} clickOptions={handleOptions} clickDelete={handleDelete} optionsLength={userRecipes ? userRecipes.length : 0}>
                {userRecipes && userRecipes.length > 0 ? (
                    recipeTitles.filter((item) => item.toLowerCase().includes(recipeSearch.toLowerCase().trim())).map((item, index) => (
                        <InSearchItemButton key={index} item={item} index={index} handleChecked={handleChecked} edit={edit} checked={checked[index]} handleSeeItem={handleSeeItem}>
                            <ul className="space-x-2">{index + 1}. {item}</ul>
                        </InSearchItemButton>
                    ))
                ) : (
                    <ul className="p-2 text-start pl-7">{`Add a ${promoString} to see it here`}</ul>
                )}
            </SearchAndAdd>
        )
    )
}