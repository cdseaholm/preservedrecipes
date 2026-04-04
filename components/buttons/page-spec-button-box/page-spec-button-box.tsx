'use client'

export default function PageSpecButtonBox({ leftHandButtons, rightHandButtons, leftLabel, rightLabel, extraCss }: { leftHandButtons: React.ReactNode | null, rightHandButtons: React.ReactNode | null, leftLabel: string, rightLabel: string, extraCss?: string }) {

    const alignment = leftHandButtons && rightHandButtons ? 'justify-between' : leftHandButtons && !rightHandButtons ? 'justify-start' : !leftHandButtons && rightHandButtons ? 'justify-end' : 'justify-center';

    return (

        <div className={`flex flex-row ${alignment} items-end sm:space-x-4 w-full h-fit p-2 ${extraCss ? extraCss : ''}`}>
            <div className="flex flex-row justify-start items-center w-content h-content space-x-7" aria-label={leftLabel}>
                {leftHandButtons}
            </div>
            <div className="flex flex-row justify-evenly items-center w-content h-content space-x-7" aria-label={rightLabel}>
                {rightHandButtons}
            </div>
        </div>

    )
}