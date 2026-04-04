'use client'

export default function SubMenuButton({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {

    return (
        <button type="button" onClick={onClick} className={buttonClass}>
            <p className={textClass}>{title}</p>
        </button>
    );
}

export const buttonClass = `flex flex-row items-center px-6 hover:bg-accent/20 rounded-md space-x-2 w-full cursor-pointer py-4`;
export const textClass = `text-base md:text-lg lg:text-xl font-medium`;