import { BottomNavbar } from "@/components/bottom-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
        <div>
            {children}
            <BottomNavbar />
        </div>
    )
}

