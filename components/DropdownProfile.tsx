"use client"
import { DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { LogOutIcon, UserIcon } from "lucide-react";
import { logout } from "@/app/(auth)/logout/action";
import Image from "next/image";

interface DropdownProfileProps {
  avatarUrl: string
  username?: string
  email?: string
  onLogout?: () => Promise<void> | void
  menuItems?: {
    icon?: React.ReactNode
    label: string
    onClick: () => void
  }[]
}

export default function DropdownProfile({ 
  avatarUrl, 
  username,
  email,
  onLogout = logout,
  menuItems = [
    {
      icon: <UserIcon className="h-4 w-4" />,
      label: "Profile",
      onClick: () => {
        console.log("Profile");
      }
    },
    {
      icon: <LogOutIcon className="h-4 w-4" />,
      label: "Logout",
      onClick: () => {
        onLogout();
      }
    }
  ]
}: DropdownProfileProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="outline-none hover:opacity-80 transition-opacity">
                    <Image 
                      src={avatarUrl} 
                      alt="Avatar" 
                      width={32} 
                      height={32} 
                      className="rounded-full" 
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuLabel className="flex items-center gap-2 p-2 ">
                    <Image 
                      src={avatarUrl} 
                      alt="Avatar" 
                      width={24} 
                      height={24} 
                      className="rounded-full" 
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold truncate text-left ">{username}</span>
                      <span className="text-xs text-muted-foreground text-left">{email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {menuItems.map((item, index) => (
                    <DropdownMenuItem 
                      key={index} 
                      onClick={item.onClick}
                     
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}