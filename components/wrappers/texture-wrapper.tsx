'use client'

export default function TextureWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full relative">
            <div 
                className="absolute inset-0 bg-[url(/images/old-paper.jpg)] bg-no-repeat bg-cover opacity-30 pointer-events-none z-0"
                aria-hidden="true"
            />
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}