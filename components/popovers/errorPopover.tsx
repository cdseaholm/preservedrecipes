import { errorType } from "@/models/types/error";
import { Popover } from "@mantine/core";
import { BiError } from "react-icons/bi";

export default function ErrorPopover({ errors, width }: { errors: errorType[], width: number }) {

    return (
        errors && errors.length !== 0 ? (
            <Popover width={width > 500 ? 500 : width - 50} position='bottom-end' withArrow shadow="md">
                <Popover.Target>
                    <div className='cursor-pointer flex flex-row justify-evenly w-fit h-full items-center font-semibold'>
                        <BiError color="#dc2626" />
                        <p className="text-red-600">Error!</p>
                    </div>
                </Popover.Target>
                <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }}>
                    {errors.map((error, index) => {
                        const errorMessage = error ? error.message as string : '';
                        return (<li key={index}>{errorMessage}</li>)
                    })}
                </Popover.Dropdown>
            </Popover>
        ) : (
            <div className='flex flex-row justify-evenly w-fit h-full items-center'>
                <BiError color="#fee2e2" />
                <p className="text-red-100">No errors</p>
            </div>
        )
    )
}