import Link from "next/link"
import { Home, PieChart, DollarSign, Settings, User } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
export function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <div className="flex justify-around py-2">
        <Link href="/dashboard" className="flex flex-col items-center p-2">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/transactions" className="flex flex-col items-center p-2">
          <DollarSign className="h-6 w-6" />
          <span className="text-xs mt-1">Transactions</span>

        </Link>
        <Link href="/manage" className="flex flex-col items-center p-2">
          <PieChart className="h-6 w-6" />
          <span className="text-xs mt-1">Budgets</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center p-2">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  )
}

