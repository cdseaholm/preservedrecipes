'use client'

import { BiLeftArrow } from "react-icons/bi"

export default function ViewSpecificIitemHead({ handleSeeItem, saveItemChanges, changesMade }: { handleSeeItem: (index: number) => void, saveItemChanges: () => Promise<void>, changesMade: boolean }) {
    return (
        <div className="flex flex-row justify-between items-center w-full border-b border-accent/50 p-3">
            <button type="button" onClick={() => handleSeeItem(-1)} aria-label="Back" className={`flex flex-row justify-center items-center space-x-2 w-[75px] h-fit p-2 border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 cursor-pointer`}>
                <BiLeftArrow size={12} />
                <p className="text-[12px]">Back</p>
            </button>
            {<button type="button" onClick={() => saveItemChanges()} aria-label="Save changes" disabled={changesMade ? false : true} className={`border border-neutral-200 rounded-md ${changesMade ? 'hover:bg-blue-200 bg-blue-400 cursor-pointer' : 'bg-gray-300 text-white'} p-2 w-[75px] h-fit`}>
                <p className="text-[12px]">Save</p>
            </button>}
        </div>
    )
}