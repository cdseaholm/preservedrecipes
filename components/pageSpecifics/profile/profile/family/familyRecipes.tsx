'use client'

import InSearchItemButton from "@/components/buttons/inSearchItemButton"
import SearchAndAdd from "@/components/misc/searchBox/searchAndAdd"
import InfoPopover from "@/components/popovers/infoPopover"
import { useModalStore } from "@/context/modalStore"
import { IRecipe } from "@/models/types/recipe"
import { IUser } from "@/models/types/user"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import ViewSpecificItem from "../profileHelpers/viewSpecificItem"

export default function FamilyRecipes({ userInfo, type, additionString, searchString, promoString, handleDelete, handleOptions, handleEdit, handleCheckedRec, handleCreate, handleFamilyRecipeSearch, familyRecipeSearch, edit, recChecked, famRecipeTitles }: { userInfo: IUser, type: string, additionString: string[], searchString: string[], promoString: string[], handleDelete: () => void, handleOptions: () => void, handleEdit: () => void, handleCheckedRec: (index: number) => void, handleCreate: (which: string, open: boolean) => void, handleFamilyRecipeSearch: (e: ChangeEvent<HTMLInputElement>) => void, familyRecipeSearch: string, edit: boolean, recChecked: boolean[], famRecipeTitles: string[] }) {

    const famRecipeTitlesLen = famRecipeTitles ? famRecipeTitles.length : 0;
    const familyID = userInfo ? userInfo.userFamilyID : '';
    const [itemToView, setItemToView] = useState<IRecipe | null>(null);

    const handleSeeItem = (index: number) => {
        if (index === -1) {
            setItemToView(null)
        } else {
            //setItemToView(suggestions[index])
            toast.info(index)
        }
    }

    return (
        familyID !== '' ? (
            itemToView ? (

                <ViewSpecificItem item={itemToView} handleSeeItem={handleSeeItem} parent={'suggestions'} />

            ) : (
                <div className="flex flex-col justify-evenly items-center w-full h-content divide-y divide-gray-400 space-y-2">
                    <SearchAndAdd handleSearch={handleFamilyRecipeSearch} handleCreate={handleCreate} type={type} additionString={additionString[0]} searchString={searchString[0]} index={0} handleEdit={handleEdit} edit={edit} totalSelected={recChecked.filter((check) => check !== false).length} clickOptions={handleOptions} clickDelete={handleDelete} optionsLength={famRecipeTitlesLen}>
                        {famRecipeTitlesLen > 0 ? (
                            famRecipeTitles.filter((item) => item.toLowerCase().includes(familyRecipeSearch.toLowerCase().trim())).map((item, index) => (
                                <InSearchItemButton key={index} item={item} index={index} handleChecked={handleCheckedRec} edit={edit} checked={recChecked[index]} handleSeeItem={handleSeeItem}>
                                    <ul className="space-x-2">{index + 1}. {item}</ul>
                                </InSearchItemButton>
                            ))
                        ) : (
                            <ul className="p-2 text-start pl-7">{`Add a ${promoString[0]} to see it here`}</ul>
                        )}
                    </SearchAndAdd>
                </div>
            )
        ) : (
            <div className="flex flex-col justify-evenly items-center w-full h-[300px] space-y-3">
                <button onClick={() => useModalStore.getState().setOpenCreateFamilyModal(true)}>
                    {`Create a family tree`}
                </button>
                <p>
                    {userInfo.userFamilyID}
                </p>
                <InfoPopover title="Looking to join an existing family tree?" infoOne="Have the admin or creator of your family send you an invite either through this site or to your email." infoTwo="From there you just need to accept!" />
            </div>
        )
    )
}