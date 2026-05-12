'use client'

export default function FilterAndSortDetailsRow({ filterLabel, sortLabel }: { filterLabel: string | null, sortLabel: string | null }) {

    const formatLabel = (label: string) => {
        return label
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    if (!filterLabel && !sortLabel) return null;

    return (
        <div className="flex w-full flex-wrap items-end justify-start gap-x-2 gap-y-1 px-0 text-end text-mainText/80 sm:px-2">
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
