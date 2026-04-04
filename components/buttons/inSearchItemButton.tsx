'use client'

import { Checkbox } from "@mantine/core";
import { BiChevronRight } from "react-icons/bi";

export default function InSearchItemButton({ 
    item,  
    children, 
    edit, 
    checked, 
    handleChecked, 
    handleSeeItem 
}: { 
    item: string;
    children: React.ReactNode;
    edit: boolean;
    checked: boolean;
    handleChecked: () => void; // ✅ No longer needs index parameter
    handleSeeItem: () => void; // ✅ No longer needs index parameter
}) {

    return (
        <div className={`flex flex-row w-[100%] items-center justify-center ${edit ? 'pl-3' : 'px-4'} text-sm lg:text-base hover:bg-gray-200 hover:text-highlight p-2 text-start border border-accent/30 rounded-md cursor-pointer mb-2`} key={item}>
            {edit ? (
                <button 
                    value={item} 
                    type="button" 
                    className={`flex flex-row w-full h-content text-ellipsis text-start justify-start space-x-2 cursor-pointer`} 
                    onClick={handleChecked}
                >
                    <Checkbox 
                        checked={checked} 
                        className="cursor-pointer w-content" 
                        aria-label="Edit checkbox"
                    />
                    {children}
                </button>
            ) : (
                <button 
                    type="button" 
                    value={item} 
                    className={`flex flex-row w-full h-content text-ellipsis text-start items-center cursor-pointer justify-between`} 
                    onClick={handleSeeItem}
                    aria-label="Specific item button"
                >
                    {children}
                    <BiChevronRight className="h-fit w-fit cursor-pointer" size={16} />
                </button>
            )}
        </div>
    );
}