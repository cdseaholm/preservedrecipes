'use client'

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
        <div className={`mb-2 flex w-full flex-row items-center justify-center ${edit ? 'pl-3 pr-2' : 'px-2'} rounded-md border border-accent/15 bg-cardBack/85 p-2 text-start text-sm text-mainText shadow-sm transition hover:-translate-y-0.5 hover:border-accent/35 hover:bg-cardBack hover:shadow-[var(--tightShadow)] lg:text-base`} key={item}>
            {edit ? (
                <button
                    value={item}
                    type="button"
                    className="flex h-content w-full cursor-pointer flex-row justify-start gap-2 text-start"
                    onClick={handleChecked}
                    aria-label={`Select ${item}`}
                    aria-pressed={checked}
                >
                    <span
                        aria-hidden="true"
                        className={`mt-0.5 size-4 shrink-0 rounded border border-accent/50 ${checked ? 'bg-accent shadow-[inset_0_0_0_3px_white]' : 'bg-white'}`}
                    />
                    {children}
                </button>
            ) : (
                <button 
                    type="button" 
                    value={item} 
                    className="flex h-content w-full cursor-pointer flex-row items-center justify-between gap-2 text-start"
                    onClick={handleSeeItem}
                    aria-label={`View ${item}`}
                >
                    {children}
                    <BiChevronRight className="h-fit w-fit shrink-0 cursor-pointer text-accent" size={18} aria-hidden="true" />
                </button>
            )}
        </div>
    );
}
