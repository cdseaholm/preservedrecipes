'use client'

import { ICommunity } from "@/models/types/community/community"
import { IRecipe } from "@/models/types/recipes/recipe"
//import { FaSave } from "react-icons/fa";
import { Tooltip } from "@mantine/core";
import { IUser } from "@/models/types/personal/user";
import { FiUsers } from "react-icons/fi";
import { FaLock } from "react-icons/fa";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

export default function CardTemplate({ recipeProps, communityProps, index, userInfo }: { recipeProps: IRecipe | null, communityProps: ICommunity | null, index: number, userInfo: IUser | null }) {

    const rating = recipeProps && recipeProps.reviews && recipeProps.reviews.length > 0 ? (recipeProps.reviews.reduce((acc, r) => acc + (r.rating ? r.rating : 0), 0) / recipeProps.reviews.length).toFixed(1) : null;
    // Check if current user has favorited this recipe
    const isFavoritedByUser = recipeProps && userInfo?.favoriteRecipeIDs?.includes(recipeProps._id);
    const favoriteCount = recipeProps && recipeProps.favoriteCount ? recipeProps.favoriteCount : 0;

    return (
        (recipeProps || communityProps) && (
            <div className="flex h-full w-full flex-col items-start justify-start gap-2 rounded-md p-2 sm:p-3">
                <div className="flex w-full flex-row items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-row items-start justify-start gap-2">
                        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-accent/10 text-xs font-bold text-accent">
                            {index + 1}
                        </span>
                        <h2 className="min-w-0 break-words text-base font-semibold leading-snug text-mainText sm:text-lg">{(recipeProps && recipeProps.name) || (communityProps && communityProps.name)}</h2>
                    </div>
                    <span className="shrink-0 rounded-md bg-mainBack px-2 py-1 text-xs font-medium text-mainText/65">{rating ? rating : 'No rating'}</span>
                </div>
                {recipeProps ? (
                    <div className="flex w-full flex-row flex-wrap items-center justify-between gap-2 pl-8 sm:pl-8">
                        <Tooltip label={
                            recipeProps.tags && recipeProps.tags.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {recipeProps.tags.map((tag, idx) => (
                                        <li key={idx}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</li>
                                    ))}
                                </ul>
                            ) : (
                                "No tags available"
                            )} w={'auto'} withArrow>
                            <p className="rounded-md border border-accent/10 bg-mainBack/70 px-2 py-1 text-xs font-medium text-mainText/70">{recipeProps.recipeType ? <span>{recipeProps.recipeType}</span> : <span>No type</span>}</p>
                        </Tooltip>

                        <div className="flex w-content flex-row items-center justify-start gap-3">
                            {recipeProps.creatorID === userInfo?._id ? (
                                <p className={`rounded-md px-2 py-1 text-xs font-medium ${recipeProps.secret ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{recipeProps.secret ? 'Secret' : 'Public'}</p>
                            ) : (
                                // <span className="text-xs text-gray-500"><FaSave /></span>
                                null
                            )}
                            <span className={`flex w-content flex-row items-center justify-around gap-1.5 text-xs font-medium ${isFavoritedByUser ? 'text-red-500' : 'text-mainText/55'}`}>
                                {isFavoritedByUser ? <IoHeart size={22}/> : <IoHeartOutline size={22} />} {favoriteCount}
                            </span>
                        </div>
                    </div>
                ) : communityProps ? (
                    <div className="flex w-full flex-row items-center justify-between gap-2 pl-8">
                        <span className="inline-flex items-center gap-1 text-xs text-mainText/60"><FiUsers /> {communityProps.communityMemberIDs.length || 0}</span>
                        <span className={communityProps.privacyLevel === "public" ? "text-green-500" : communityProps.privacyLevel === "private" ? "text-red-500" : "text-yellow-500"}><FaLock /> {communityProps.privacyLevel}</span>
                    </div>
                ) : null}
            </div>
        )
    );
}
