function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex flex-col items-center justify-center h-screen">
            {children}
        </div>
    );
}

export default Layout;
