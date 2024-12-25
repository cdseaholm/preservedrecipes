'use client'

import ContentButtons from "@/components/buttons/contentButtons";
import { useStateStore } from "@/context/stateStore";
import { User } from "next-auth";
import { toast } from "sonner";

export default function WelcomeSection({ user }: { user: User | null }) {

    const height = useStateStore(state => state.heightQuery);
    const thirdDivheightSpecs = height < 800 ? 'h-2/3' : 'h-1/2';
    const contentHeightSpecs = height < 800 ? 'md:my-1' : 'h-auto p-3 md:p-5';

    const contentButtonExtraProps = `flex flex-col justify-center items-center w-full h-auto ${contentHeightSpecs}`;
    const thirdDivStyle = `grid grid-cols-1 grid-rows-3 gap-7 m-2 p-4 md:p-8 sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 bg-transparent relative overflow-hidden text-lightText shadow-xl shadow-highlight/50 relative overflow-hidden border border-mainText/30 w-full rounded-md ${thirdDivheightSpecs}`;


    return (
        <div className="homeDiv h-full w-full flex flex-col justify-start items-center">
            <div className={`flex flex-col items-center justify-evenly px-5 bg-mainBack/90 h-full w-full h-full`}>
                <h2 className="flex flex-row items-center justify-start text-3xl md:text-4xl font-semibold w-full text-mainText pt-8 titlePoint1" style={{ minHeight: '100' }}>
                    Preserve Your Family Recipes
                </h2>
                <div className="flex flex-row items-center justify-center w-full h-4/5">
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
        </div>
    )
}