import { ChangeEvent, JSX } from "react";
import { BiPlus, BiPencil } from "react-icons/bi";
import { toast } from "sonner";

export default function ProfileSearchAndAdd({ handleSearch, handleCreate, options, type, mobile }: { handleSearch: (input: ChangeEvent<HTMLInputElement>) => void, handleCreate: (which: string, open: boolean) => void, options: JSX.Element[], type: string, mobile: boolean }) {

    return (
        <div className={`bg-mainBack p-1 w-[95%] ${mobile ? 'min-h-[300px] h-full' : 'min-h-[230px] h-1/2'} flex flex-col justify-start items-center rounded-md border border-accent/50 pt-3 px-5 pb-5`}>
            <div className="flex flex-row justify-between items-center w-full h-1/5">
                <div className={`flex flex-col justify-center items-start w-1/2 h-full ${mobile ? 'text-sm' : ''}`}>
                    {type === 'recipe' ? 'Recipes' : 'Communities'}
                </div>
                <div className="flex flex-row justify-end items-center space-x-4 w-1/2 h-full">
                    <button onClick={() => handleCreate(type, true)} className={`h-fit w-fit flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md ${mobile ? 'text-xs' : ''}`}>
                        <BiPlus />
                        <p>{`${type === 'recipe' ? 'Create Recipes' : 'Join Communities'}`}</p>
                    </button>
                    <button onClick={() => toast.info('Delete recipe')} className={`h-fit w-fit flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md ${mobile ? 'text-xs' : ''}`}>
                        <BiPencil />
                        <p>{`Edit ${type === 'recipe' ? 'Recipes' : 'Communities'}`}</p>
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-start items-start w-[100%] h-full bg-mainContent">
                <input type="text" onChange={(e) => handleSearch(e)} className="flex flex-row w-full p-2 text-sm lg:text-md border-b border-highlight/50" placeholder={`Search your ${type === 'recipe' ? 'recipes' : 'communities'}`} />
                <div className="scrollbar-thin scrollbar-webkit w-[100%] h-[130px] overflow-auto">
                    {options.length > 0 ? options : <p>{`Add a ${type} to see it here`}</p>}
                </div>
            </div>
        </div>
    )
}