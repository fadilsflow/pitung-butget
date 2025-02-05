

import { BottomNavbar } from "@/components/bottom-nav";
import { TopNav } from "@/components/top-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <BottomNavbar />
      <TopNav>
        {children}
      </TopNav>
    </div>
  )

}
