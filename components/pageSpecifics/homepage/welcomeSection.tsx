'use client'

import ContentButtons from "@/components/buttons/contentButtons";
import { useStateStore } from "@/context/stateStore";
import { User } from "next-auth";
import { toast } from "sonner";

export default function WelcomeSection({ user }: { user: User | null }) {

    const thirdDivStyle = `bg-mainContent flex flex-col rounded-lg text-lightText justify-evenly items-center shadow-xl shadow-highlight/50 relative overflow-hidden border border-mainText/30 w-full sm:w-3/4 space-y-12 p-2 py-8 md:p-8`;

    const contentButtonExtraProps = `flex flex-col justify-center items-center w-full text-sm sm:w-3/4 lg:w-2/3 lg:text-lg xl:w-1/2 2xl:w-2/5 p-3`;

    const height = useStateStore(state => state.heightQuery);
    let spacePerHeight = height < 700 ? 'space-y-24' : height < 900 ? 'space-y-40' : 'space-y-52';


    return (
        <div className="homeDiv h-full w-full flex flex-col justify-start items-center" style={{minHeight: '600'}}>
            <div className={`flex flex-col items-center justify-start px-5 bg-mainBack/90 h-full w-full ${spacePerHeight}`} style={{minHeight: '600'}}>
                <h2 className="flex flex-row items-center justify-start text-3xl md:text-4xl font-semibold w-full text-mainText pt-8 titlePoint1">
                    Preserve Your Family Recipes
                </h2>
                {user ? (
                    <div className={thirdDivStyle}>
                        <ContentButtons content="Sign-In or Sign-Up" onClick={() => toast.info(`You would sign up right now`)} extraProps={contentButtonExtraProps} />
                        <ContentButtons content="Create or Join your Family's Recipe Tree" onClick={() => toast.info(`You would create or join a family tree right now right now`)} extraProps={contentButtonExtraProps} />
                        <ContentButtons content="Learn More" onClick={() => toast.info(`You would learn more right now`)} extraProps={contentButtonExtraProps} />
                    </div>
                ) : (
                    <div className={thirdDivStyle}>
                        <ContentButtons content="Sign-In or Sign-Up" onClick={() => toast.info(`You would sign up right now`)} extraProps={contentButtonExtraProps} />
                        <ContentButtons content="Create or Join your Family's Recipe Tree" onClick={() => toast.info(`You would create or join a family tree right now right now`)} extraProps={contentButtonExtraProps} />
                        <ContentButtons content="Learn More" onClick={() => toast.info(`You would learn more right now`)} extraProps={contentButtonExtraProps} />
                    </div>
                )}
            </div>
        </div>
    )
}