import { ChangeEvent, JSX } from "react";
import { BiPlus, BiPencil } from "react-icons/bi";
import { toast } from "sonner";

export default function SearchAndAdd({ handleSearch, handleCreate, options, type, mobile, additionString, searchString, promoString, index }: { handleSearch: (input: ChangeEvent<HTMLInputElement>, index: number, ) => void, handleCreate: (which: string, open: boolean) => void, options: JSX.Element[], type: string, mobile: boolean, additionString: string, searchString: string, promoString: string, index: number }) {

    return (
        <div className={`bg-mainBack p-1 w-full ${mobile ? 'min-h-[300px] h-full' : 'min-h-[230px] h-1/2'} flex flex-col justify-start items-center rounded-md border border-accent/50 pt-3 px-5 pb-5`}>
            <div className={`flex flex-row justify-start items-start w-full h-fit ${mobile ? 'text-sm' : ''}`}>
                {type}
            </div>
            <div className="flex flex-row justify-evenly items-center space-x-4 w-full h-fit p-2">
                <button onClick={() => handleCreate(type, true)} className={`h-fit w-fit flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md ${mobile ? 'text-xs' : ''}`}>
                    <BiPlus />
                    {additionString}
                </button>
                <button onClick={() => toast.info('Delete recipe')} className={`h-fit w-fit flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md ${mobile ? 'text-xs' : ''}`}>
                    <BiPencil />
                    <p>{`Edit`}</p>
                </button>
            </div>
            <div className="flex flex-col justify-start items-start w-[100%] h-full bg-mainContent">
                <input type="text" onChange={(e) => handleSearch(e, index)} className="flex flex-row w-full p-2 text-sm lg:text-md border-b border-highlight/50" placeholder={`Search your ${searchString}`} />
                <div className="scrollbar-thin scrollbar-webkit w-[100%] h-[130px] overflow-auto">
                    {options.length > 0 ? options : <p>{`Add a ${promoString} to see it here`}</p>}
                </div>
            </div>
        </div>
    )
}