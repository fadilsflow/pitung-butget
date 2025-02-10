import { BottomNavbar } from "@/components/bottom-nav";
import { TopNav } from "@/components/top-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div >
      <TopNav />
      <main className="flex-1">
        {children}
      </main>
      <BottomNavbar />
    </div>
  )
}
