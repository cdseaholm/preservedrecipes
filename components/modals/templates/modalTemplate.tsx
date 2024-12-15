export default function ModalTemplate({ children, subtitle }: { children: React.ReactNode, subtitle: string | null }) {
    return (
        <main style={{ minWidth: '15vh', minHeight: '15vh' }} className="flex flex-col justify-evenly items-center">
            {subtitle ? (
                <section className="w-full text-center">
                    {subtitle}
                </section>
            ) : (
                null
            )}
            {children}
        </main>
    )
}