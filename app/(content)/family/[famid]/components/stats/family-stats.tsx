'use client'

import { IFamily } from "@/models/types/family/family";

export default function FamilyStats({ family }: { family: IFamily }) {

    //might be a useful page? Might note, still undecided
    const recipeCount = family.recipeIDs?.length ?? 0;
    const members = family.familyMembers?.length ?? 0;

    return (
        <div className="w-full grid grid-cols-2 gap-4 flex flex-row justify-center items-center my-4">
            <div className="bg-secondaryBack p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold">Recipes</h2>
                <p className="text-2xl">{recipeCount}</p>
            </div>
            <div className="bg-secondaryBack p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold">Members</h2>
                <p className="text-2xl">{members}</p>
            </div>
        </div>
    )
}