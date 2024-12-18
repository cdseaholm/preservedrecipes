export default function MainTemplate({children}: {children: React.ReactNode}) {
    return (
        <main className={`w-full scrollbar-thin scrollbar-webkit`} style={{overflowX: 'hidden', overflowY: 'auto', height: '93vh'}}>
            {children}
        </main>
    )
}