'use client'

import { Checkbox } from "@mantine/core";
import { BiChevronRight } from "react-icons/bi";
import { toast } from "sonner";

export default function InSearchItemButton({ item, index, children, edit, checked, handleChecked }: { item: string, index: number, children: React.ReactNode, edit: boolean, checked: boolean, handleChecked: (index: number) => void }) {

    const handleEditButton = () => {
        handleChecked(index);
    };

    return (
        <div key={index} className={`flex flex-row w-[100%] items-center justify-start ${edit ? 'pl-3' : 'pl-7'} text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start border border-accent/30 rounded-md m-1`}>
            {edit ? (
                <button value={item} className={`flex flex-row w-full h-content text-ellipsis ${edit ? 'justify-start space-x-2' : 'justify-between'}`} onClick={handleEditButton}>
                    <Checkbox checked={checked} onChange={handleEditButton} style={{cursor: 'pointer'}} className="cursor-pointer"/>
                    {children}
                </button>
            ) : (
                <button value={item} className={`flex flex-row w-full h-content text-ellipsis ${edit ? 'justify-start space-x-2' : 'justify-between'}`} onClick={() => {
                    toast.info('This item');
                }}>
                    {children}
                    <BiChevronRight />
                </button>
            )}
        </div>
    );
}