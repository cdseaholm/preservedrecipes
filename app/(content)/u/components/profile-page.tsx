'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { IFamily } from "@/models/types/family/family";
import { IUser } from "@/models/types/personal/user";
import { IReview } from "@/models/types/misc/review";

export default function ProfilePage({ user, familyData, reviews }: { user: IUser, familyData: IFamily | null, reviews: IReview[] }) {

    const recipeCount = user.recipeIDs ? user.recipeIDs.length : 0;
    const communityCount = user.communityIDs ? user.communityIDs.length : 0;
    const family = familyData ? familyData.name : 'No family name set';
    const timeBeingMember = user.createdAt ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const ratingsGiven = reviews.filter(rc => rc.rating !== null).length;
    const commentsMade = reviews.filter(rc => rc.comment !== null).length;

    return (
        <NavWrapper userInfo={user} loadingChild={null}>
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                <div className={`p-1 w-full h-full flex flex-col justify-evenly items-center py-2`}>
                    <h1 className="text-3xl font-bold">{user.name}'s Profile</h1>
                    <p className="text-lg">Family: {family}</p>
                    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        <div className="bg-secondaryBack p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
                            <h2 className="text-xl font-semibold">Recipes</h2>
                            <p className="text-2xl">{recipeCount}</p>
                        </div>
                        <div className="bg-secondaryBack p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
                            <h2 className="text-xl font-semibold">Communities</h2>
                            <p className="text-2xl">{communityCount}</p>
                        </div>
                        <div className="bg-secondaryBack p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
                            <h2 className="text-xl font-semibold">Ratings Given</h2>
                            <p className="text-2xl">{ratingsGiven}</p>
                        </div>
                        <div className="bg-secondaryBack p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
                            <h2 className="text-xl font-semibold">Comments Made</h2>
                            <p className="text-2xl">{commentsMade}</p>
                        </div>
                        <div className="bg-secondaryBack p-4 rounded-lg shadow-md flex flex-col justify-center items-center col-span-2 sm:col-span-1">
                            <h2 className="text-xl font-semibold">Member For</h2>
                            <p className="text-2xl">{timeBeingMember} days</p>
                        </div>
                    </div>
                </div>
            </ContentWrapper>
        </NavWrapper>
    );
}