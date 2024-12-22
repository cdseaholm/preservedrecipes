export default function MainTemplate({children}: {children: React.ReactNode}) {
    return (
        <main className={`w-full scrollbar-thin scrollbar-webkit`} style={{overflowX: 'hidden', overflowY: 'auto', height: '100vh', minHeight: '800'}}>
            {children}
        </main>
    )
}