export default function InfoSection() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className={`bg-blue-200 flex flex-row rounded-lg text-black w-5/6 h-3/5`}>
                <div className="flex flex-col justify-center items-center w-1/2 h-full border border-neutral-500">
                    Uses AI to interact with you and help you design your perfect vacation
                </div>
                <div className="flex flex-col justify-center items-center w-1/2 h-full border border-neutral-500">
                    View past vacations or create new Itinerary for an upcoming vacation
                </div>
            </div>
        </div>
    )
}