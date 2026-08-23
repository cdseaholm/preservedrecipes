'use client'

export default function TextureWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative h-full w-full bg-background">
            <div 
                className="pointer-events-none absolute inset-0 z-0 bg-[url(/images/old-paper.jpg)] bg-cover bg-center opacity-[0.18] mix-blend-multiply dark:opacity-[0.045] dark:mix-blend-normal"
                aria-hidden="true"
            />
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
}
