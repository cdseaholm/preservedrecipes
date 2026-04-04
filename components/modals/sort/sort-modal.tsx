'use client'


import BasicSort from "@/components/buttons/filter-and-sorts/basic-sort";
import { useWindowSizes } from "@/context/width-height-store";
import { Modal } from "@mantine/core"

export default function SortModal({ open, handleClose, handleSort, sortData, value }: { open: boolean, handleClose: () => void, handleSort: (sort: string | null) => void, sortData: { label: string, value: string }[], value: string | null }) {

    const { width } = useWindowSizes();

    return (
        <Modal opened={open} onClose={handleClose} title="Sort" centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'}>

            <BasicSort
                widthQuery={width}
                handleSort={handleSort}
                data={sortData}
                defaultValue=""
                value={value}
            />

        </Modal>
    )
}