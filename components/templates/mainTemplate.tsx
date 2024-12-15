export default function MainTemplate({children}: {children: React.ReactNode}) {
    return (
        <main className={`w-screen h-screen scrollbar-thin scrollbar-webkit`} style={{overflowX: 'hidden'}}>
            {children}
        </main>
    )
}