import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import ModalTemplate from "./modalTemplate";

export default function LoadingModal() {
    return (
        <ModalTemplate subtitle={null} minHeight="15vh" minWidth="15vw">
            <LoadingSpinner />
        </ModalTemplate>
    )
}