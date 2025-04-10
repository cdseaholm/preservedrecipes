'use client'

import { IFamilyMember } from "@/models/types/familyMember"
import { BiLeftArrow } from "react-icons/bi"

export default function SpecificMemberView({ memberToView, handleSeeItem }: { memberToView: IFamilyMember, handleSeeItem: (index: number) => void }) {

    const details = [
        'Recipes Created',
        'Date joined Family',
        'Ratings/Comments',
        'Communities'
    ];


    return (
        <div className={`bg-mainBack p-1 w-full min-h-[300px] sm:min-h-[230px] sm:h-1/2 flex flex-col justify-evenly items-center py-2 sm:px-5`}>
            <div className={`flex flex-row justify-between items-center sm:space-x-4 w-full h-fit p-2`}>
                <button onClick={() => handleSeeItem(-1)} className={`h-content w-content flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md text-sm sm:text-md space-x-1 cursor-pointer`} aria-label="Go back to Members list">
                    <BiLeftArrow />
                    <p>{`Back`}</p>
                </button>
                <h2 className="text-lg font-semibold">
                    {`${memberToView.familyMemberName} Overview`}
                </h2>
            </div>
            <div className="flex flex-col justify-start items-start w-[100%] h-content min-h-[450px] bg-mainContent border border-accent/30 rounded-md p-4">
                <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1">
                    {details.map((det, index) => {
                        return (
                            <div className="min-w-[200px] min-h-[200px] rounded-md border border-accent/30 p-1 flex flex-col justify-center items-center text-center" key={index}>
                                {det}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}