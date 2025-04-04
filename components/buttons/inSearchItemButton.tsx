'use client'

import { Checkbox } from "@mantine/core";
import { BiChevronRight } from "react-icons/bi";

export default function InSearchItemButton({ item, index, children, edit, checked, handleChecked, handleSeeItem }: { item: string, index: number, children: React.ReactNode, edit: boolean, checked: boolean, handleChecked: (index: number) => void, handleSeeItem: (index: number) => void }) {

    const handleEditButton = () => {
        handleChecked(index);
    };

    return (
        <div key={index} className={`flex flex-row w-[100%] items-center justify-start ${edit ? 'pl-3' : 'px-4'} text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start border border-accent/30 rounded-md m-1 cursor-pointer`}>
            {edit ? (
                <button value={item} className={`flex flex-row w-full h-content text-ellipsis text-start justify-start space-x-2 cursor-pointer`} onClick={handleEditButton}>
                    <Checkbox checked={checked} onChange={handleEditButton} style={{ cursor: 'pointer' }} className="cursor-pointer w-content" aria-label="Edit checkbox"/>
                    {children}
                </button>
            ) : (
                <button type="button" value={item} className={`flex flex-row w-full h-content text-ellipsis text-start items-center cursor-pointer justify-between`} onClick={() => {
                    handleSeeItem(index)
                }} aria-label="Specific item button">
                    {children}
                    <BiChevronRight height={'auto'} width={'auto'} className="h-fit w-fit cursor-pointer" size={16} />
                </button>
            )}
        </div>
    );
}