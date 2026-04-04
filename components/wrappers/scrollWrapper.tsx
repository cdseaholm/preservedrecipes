'use client'

export default function ScrollWrapper({ children }: { children: React.ReactNode }) {

    return (
        <div
            className="absolute w-full h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-webkit space-y-2 z-5"
            style={{ scrollbarGutter: 'stable' }}
        >
            {children}
        </div>
    );
}