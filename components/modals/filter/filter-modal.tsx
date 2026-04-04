'use client'

import BasicFilter from "@/components/buttons/filter-and-sorts/basic-filter"
import { useWindowSizes } from "@/context/width-height-store"
import { Modal } from "@mantine/core"

export default function FilterModal({ open, handleClose, handleFilter, filterData, value }: { open: boolean, handleClose: () => void, handleFilter: (filter: string | null) => void, filterData: { label: string, value: string }[], value: string | null }) {

    const { width } = useWindowSizes();

    return (
        <Modal opened={open} onClose={handleClose} title="Filter" centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'}>

            <BasicFilter
                widthQuery={width}
                handleFilter={handleFilter}
                data={filterData}
                defaultFilter=""
                value={value}
            />

        </Modal>
    )
}