import { LoadingSpinner } from "@/components/misc/loadingSpinner";

export default function LoadingModal() {
    return (
        <main style={{ maxWidth: '15vw', minHeight: '15vh' }} className="flex flex-col justify-evenly items-center">
            <LoadingSpinner screen={false}/>
        </main>
    )
}