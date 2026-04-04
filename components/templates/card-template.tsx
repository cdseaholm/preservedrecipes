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
            <div className="w-full h-full p-4 flex flex-col justify-start items-start border-r border-accent/30 rounded-md">
                <div className="flex flex-row items-center justify-between mb-2 w-full">
                    <div className="flex flex-row items-center justify-start gap-2">
                        {index + 1}.
                        <h2 className="text-lg font-semibold">{(recipeProps && recipeProps.name) || (communityProps && communityProps.name)}</h2>
                    </div>
                    <span className="text-xs text-gray-500">{rating ? rating : 'No Rating'}</span>
                </div>
                {recipeProps ? (
                    <div className="flex flex-row items-center justify-between gap-2 mb-2 w-full px-4">
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
                            <p>{recipeProps.recipeType ? <span>{recipeProps.recipeType}</span> : <span>No Type</span>}</p>
                        </Tooltip>

                        <div className="flex flex-row items-center justify-start gap-4 w-content">
                            {recipeProps.creatorID === userInfo?._id ? (
                                <p className={recipeProps.secret ? "text-red-500" : "text-green-500"}>{recipeProps.secret}</p>
                            ) : (
                                // <span className="text-xs text-gray-500"><FaSave /></span>
                                null
                            )}
                            <span className={`flex flex-row justify-around items-center w-content gap-2 text-xs ${isFavoritedByUser ? 'text-red-500' : 'text-gray-500'}`}>
                                {isFavoritedByUser ? <IoHeart size={22}/> : <IoHeartOutline size={22} />} {favoriteCount}
                            </span>
                        </div>
                    </div>
                ) : communityProps ? (
                    <div className="flex flex-row items-center justify-between gap-2 mb-2 w-full px-8">
                        <span className="text-xs text-gray-500"><FiUsers /> {communityProps.communityMemberIDs.length || 0}</span>
                        <span className={communityProps.privacyLevel === "public" ? "text-green-500" : communityProps.privacyLevel === "private" ? "text-red-500" : "text-yellow-500"}><FaLock /> {communityProps.privacyLevel}</span>
                    </div>
                ) : null}
            </div>
        )
    );
}