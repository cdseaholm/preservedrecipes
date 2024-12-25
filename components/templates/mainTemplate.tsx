export default function MainTemplate({ children }: { children: React.ReactNode }) {

    return (
        <main className="flex flex-col justify-start items-center w-screen scrollbar-thin scrollbar-webkit" style={{ overflowX: 'hidden', overflowY: 'auto', height: 'calc(100vh - 75px)' }}>
            <div className="content">
                {children}
            </div>
        </main>
    )
}