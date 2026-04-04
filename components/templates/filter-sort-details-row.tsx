'use client'

export default function FilterAndSortDetailsRow({ filterLabel, sortLabel }: { filterLabel: string | null, sortLabel: string | null }) {

    const formatLabel = (label: string) => {
        return label
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="flex flex-row items-end justify-start gap-4 text-mainText/80 w-full text-end h-[20px] my-1 px-2">
            <p className="text-mainText/80 text-sm md:text-base">
                {filterLabel ? `Filtered: ${formatLabel(filterLabel)}` : ''}
            </p>
            {filterLabel && sortLabel ? <span className="text-mainText/50">|</span> : null}
            <p className="text-mainText/80 text-sm md:text-base">
                {sortLabel ? `Sorted: ${formatLabel(sortLabel)}` : ''}
            </p>
        </div>
    );
}