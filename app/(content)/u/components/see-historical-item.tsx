'use client'

import { LoadingSpinner } from "@/components/misc/loadingSpinner"
import { Modal } from "@mantine/core"

export default function SeeHistoricalItem({ itemToSee, handleClose, handleGoToItem }: { itemToSee: any | null, handleClose: () => void, handleGoToItem: () => void }) {

    return (
        <Modal opened={itemToSee !== null} onClose={handleClose} title={<h2 className="text-lg font-bold">{itemToSee?.title}</h2>} centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'80%'} closeOnEscape={true} closeOnClickOutside={true}>
            {itemToSee ? (
                <div>
                    <p className="mb-2"><strong>Date Created:</strong> {new Date(itemToSee.date).toLocaleDateString()}</p>
                    <p className="mb-2"><strong>Last Updated:</strong> {new Date(itemToSee.updatedAt).toLocaleDateString()}</p>
                    <button type="button" onClick={handleGoToItem} className="text-blue-500 underline mb-2 block">
                        View Item
                    </button>
                    {/* Add more fields as necessary */}
                </div>
            ) : (
                <LoadingSpinner />
            )}
        </Modal>
    )
}
//link to recipe didn't work