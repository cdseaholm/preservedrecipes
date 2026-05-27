'use client'

export default function PageSpecButtonBox({ leftHandButtons, rightHandButtons, leftLabel, rightLabel, extraCss }: { leftHandButtons: React.ReactNode | null, rightHandButtons: React.ReactNode | null, leftLabel: string, rightLabel: string, extraCss?: string }) {

    const alignment = leftHandButtons && rightHandButtons ? 'justify-between' : leftHandButtons && !rightHandButtons ? 'justify-start' : !leftHandButtons && rightHandButtons ? 'justify-end' : 'justify-center';

    return (

        <div className={`flex h-fit w-full flex-col gap-3 p-0 sm:flex-row sm:items-end sm:p-2 ${alignment} sm:gap-4 ${extraCss ? extraCss : ''}`}>
            <div className="flex h-content w-full flex-row flex-wrap items-center justify-start gap-2 sm:w-content sm:gap-7" aria-label={leftLabel}>
                {leftHandButtons}
            </div>
            <div className="flex h-content w-full flex-row flex-wrap items-center justify-start gap-2 sm:w-content sm:justify-end sm:gap-7" aria-label={rightLabel}>
                {rightHandButtons}
            </div>
        </div>

    )
}
