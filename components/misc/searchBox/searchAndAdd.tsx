'use client'

import { ChangeEvent } from "react";
import { BiPlus, BiPencil, BiCheck } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

export default function SearchAndAdd({ handleSearch, handleCreate, children, type, additionString, searchString, index, handleEdit, edit, totalSelected, clickOptions, clickDelete, optionsLength }: { handleSearch: (input: ChangeEvent<HTMLInputElement>, index: number) => void, handleCreate: (which: string, open: boolean) => void, children: React.ReactNode, type: string, additionString: string, searchString: string, index: number, handleEdit: () => void, edit: boolean, totalSelected: number, clickOptions: () => void, clickDelete: () => void, optionsLength: number }) {

    const buttonClass = `h-content w-content flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md text-sm sm:text-md space-x-1 cursor-pointer`;

    return (
        <div className={`bg-mainBack p-1 w-full min-h-[300px] sm:min-h-[230px] sm:h-1/2 flex flex-col justify-evenly items-center py-2 sm:px-5`}>
            <div className={`flex flex-row ${edit ? 'justify-between' : 'justify-end'} items-center sm:space-x-4 w-full h-fit p-2`}>
                {edit ? (
                    <div className="flex flex-row justify-evenly items-center w-content h-content space-x-7">
                        <button className={`${buttonClass}`} onClick={() => clickOptions()} aria-label="Edit">
                            <p>{`Edit ${totalSelected}`}</p>
                            <FaEdit height={'auto'} />
                        </button>
                        <button type="button" className={`${buttonClass}`} onClick={() => clickDelete()} aria-label="Delete">
                            <p>{`Delete ${totalSelected}`}</p>
                            <FaRegTrashAlt height={'auto'} />
                        </button>
                    </div>
                ) : (
                    null
                )
                }
                <div className="flex flex-row justify-evenly items-center w-content h-content space-x-7" aria-label="Add">
                    <button onClick={() => handleEdit()} className={buttonClass} disabled={optionsLength > 0 ? false : true} aria-label="Toggle Edit">
                        {edit ? (<BiCheck />) : (<BiPencil />)}
                        <p>{edit ? 'Done' : 'Edit'}</p>
                    </button>
                    <button onClick={() => handleCreate(type, true)} className={buttonClass}>
                        <BiPlus />
                        {additionString}
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-start items-start w-[100%] h-full bg-mainContent border border-accent/30 rounded-md">
                <input type="text" onChange={(e) => handleSearch(e, index)} className="flex flex-row w-full p-2 text-sm lg:text-md border-b border-highlight/50 shadow-inner" placeholder={`Search your ${searchString}`} />
                <div className="scrollbar-thin scrollbar-webkit w-[100%] h-[450px] sm:h-[500px] overflow-auto shadow-inner py-4 px-2 overflow-x-hidden space-y-2 flex flex-col justify-start items-center">
                    {children}
                </div>
            </div>
        </div>
    )
}