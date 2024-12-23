export default function MainTemplate({ children }: { children: React.ReactNode }) {

    return (
        <main className="w-screen scrollbar-thin scrollbar-webkit" style={{ overflowX: 'hidden', overflowY: 'auto', maxHeight: 'calc(100vh - 75px)' }}>
            <div className="content">
                {children}
            </div>
        </main>
    )
}