import ContentButtons from "@/components/buttons/contentButtons";
import { toast } from "sonner";

const thirdDivStyle = `bg-mainContent flex flex-col rounded-lg text-lightText justify-evenly items-center w-11/12 md:w-3/4 p-3 h-2/5 my-32 md:my-52 shadow-xl shadow-highlight relative overflow-hidden border border-mainText`;

const contentButtonExtraProps = `flex flex-col justify-center items-center w-full text-sm md:w-3/4 lg:w-2/3 lg:text-lg xl:w-1/2 2xl:w-2/5 p-3`;

const extraPropsTwo = `flex flex-col justify-center items-center w-full`;

export default function WelcomeSectionMock() {



    return (
        <div className="h-full w-full homeDiv">
            <div className="flex flex-col items-center justify-start h-full w-full px-5 bg-mainBack">
                <h2 className="flex flex-row items-center justify-start text-3xl md:text-4xl font-semibold w-full text-mainText w-3/4 pt-8 titlePoint1">
                    Preserve Your Family Recipes
                </h2>
                <div className={thirdDivStyle}>
                    <ContentButtons content="Sign-In or Sign-Up" onClick={() => toast.info('You would sign up now')} extraProps={contentButtonExtraProps} />
                    <ContentButtons content="Create or Join your Family's Recipe Tree" onClick={() => toast.info('You would create or join a family recipe tree now')} extraProps={contentButtonExtraProps} />
                    <ContentButtons content="Learn More" onClick={() => toast.info('You would learn more now')} extraProps={extraPropsTwo} />
                </div>
            </div>
        </div>
    )
}