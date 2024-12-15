import HomePageInitialButtons from "@/components/buttons/homepageInitialButtons";

export default function WelcomeSection() {
    return (
        <div className="flex flex-col items-center justify-start h-full w-full px-5">
            <h1 className="flex flex-row items-center justify-start text-xl md:text-2xl font-semibold w-full text-black w-3/4 pt-8">
                Welcome to VacayAI!
            </h1>
            <h2 className="flex flex-row items-center justify-start text-md md:text-lg font-semibold w-full text-black w-3/4">
                Track, Plan, and Craft a Vacation Itinerary specific to your interests!
            </h2>
            <div className={`bg-amber-100 flex flex-row rounded-lg text-black justify-evenly w-3/4 h-2/5 my-52`}>
                <HomePageInitialButtons content="Sign-In or Sign-Up" />
                <HomePageInitialButtons content="Learn More" />
            </div>
        </div>
    )
}