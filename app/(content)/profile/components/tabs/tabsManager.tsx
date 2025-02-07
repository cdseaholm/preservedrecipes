'use client'

import { useUserStore } from "@/context/userStore";
import RecipeTab from "./recipeTab";
import { Session } from "next-auth";
import { IUser } from "@/models/types/user";
import { ProfilePageType } from "../mainProfile";
import FamilyTab from "./family/familyTab";
import AccountTab from "./account/accountSettings";
import SuggestionTab from "./account/suggestionTab";

function GetChild({ activeChildIndex, session, userAdminPrivs, numAdmins, userInfo }: { activeChildIndex: ProfilePageType, session: Session, userAdminPrivs: boolean, numAdmins: number, userInfo: IUser }) {

    const userRecipes = useUserStore(s => s.userRecipes);
    const suggestions = useUserStore(s => s.suggestions);
    const parentIndex = activeChildIndex.parent;
    const childIndex = activeChildIndex.child

    const finalStrings = [
        ['Create a family recipe', 'family recipes', 'family recipe'] as string[],
        ['Add a family members', 'family members', 'family member'],
        ['Create a recipe', 'recipes', 'recipe']
    ];

    if (parentIndex === 0) {
        if (childIndex === 0) {
            return (
                <AccountTab />
            )
        } else if (childIndex === 1) {
            return (
                <p>
                    Account History
                </p>
            )
        } else {
            <SuggestionTab suggestions={suggestions} session={session} />
        }
    } else if (parentIndex === 1) {
        return (
            <FamilyTab userInfo={userInfo} type={'Family'} additionString={[finalStrings[0][0], finalStrings[1][0]]} searchString={[finalStrings[0][1], finalStrings[1][1]]} promoString={[finalStrings[0][2], finalStrings[1][2]]} numAdmins={numAdmins} userAdminPrivs={userAdminPrivs} indexToRender={childIndex} />
        )
    } else {
        return (
            <RecipeTab userRecipes={userRecipes} type={'Recipes'} additionString={finalStrings[2][0]} searchString={finalStrings[2][1]} promoString={finalStrings[2][2]} session={session} />
        )
    }
}

export default function TabsManager({ session, activeChildIndex, userAdminPrivs, numAdmins, userInfo }: { session: Session, activeChildIndex: ProfilePageType, userAdminPrivs: boolean, numAdmins: number, userInfo: IUser }) {

    return (
        <div className="flex flex-col h-full w-full justify-evenly items-center py-2 px-1 border-8 border-gray-800/10">
            {GetChild({ activeChildIndex: activeChildIndex, session: session, userAdminPrivs: userAdminPrivs, numAdmins: numAdmins, userInfo: userInfo })}
        </div>
    )
}