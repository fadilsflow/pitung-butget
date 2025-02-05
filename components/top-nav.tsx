import type * as React from "react";
import Link from "next/link";

import DropdownProfile from "./DropdownProfile";
import { createClient } from "@/app/utils/supabase/server";
import { ModeToggle } from "./mode-toggle";

const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Transactions", href: "/transactions" },
    { name: "Budget", href: "/budget" },
    { name: "Settings", href: "/settings" },
];

export async function TopNav() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
            <div className="container flex h-16 items-center justify-between border-b">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/dashboard" className="flex items-center space-x-2 pl-10">
                        <span className="inline-block text-xl font-bold text-primary">Pitung Butget</span>
                    </Link>
                    <nav className="hidden md:flex gap-6 items-center">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <nav className="flex items-center space-x-4 pr-10">
                        <ModeToggle />
                        <DropdownProfile
                            avatarUrl={user?.user_metadata?.avatar_url}
                            email={user?.email}
                            username={user?.user_metadata?.full_name}
                        />
                    </nav>
                </div>
            </div>
        </header>
    );
}