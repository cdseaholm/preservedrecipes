'use client'

import PageSpecButtonBox from "@/components/buttons/page-spec-button-box/page-spec-button-box";
import { IUserView } from "@/models/types/family/member-view";

import Link from "next/link";
import { BiLeftArrow } from "react-icons/bi"

export default function SpecificMemberView({ memberToView }: { memberToView: IUserView }) {

    const details = [
        'Recipes Created',
        'Date joined Family',
        'Ratings/Comments',
        'Communities'
    ];


    return (
        <>
            <PageSpecButtonBox
                leftHandButtons={
                    <Link href="/family/members" className={`h-content w-content flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md text-sm sm:text-md space-x-1 cursor-pointer`} aria-label="Go back to Members list">
                        <BiLeftArrow />
                        <p>{`Back`}</p>
                    </Link>
                }
                rightHandButtons={
                    <h2 className="text-lg font-semibold">
                        {`${memberToView.familyMemberName} Overview`}
                    </h2>
                }
                leftLabel="Back to Members"
                rightLabel="Member Overview"
            />
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
        </>
    )
}