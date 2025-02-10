
import { createClient } from "@/app/utils/supabase/server";
import { Button } from "@/components/ui/button";

import { redirect } from "next/navigation";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/overview";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";



const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const getUserDisplayName = (user: any) => {
    // Prioritize user metadata name
    const fullName = user?.user_metadata?.full_name?.trim();
    if (fullName) {
        // Handle multiple spaces and extract first name
        const firstName = fullName.split(/\s+/)[0];
        return firstName;
    }

    // Fallback to email username
    const email = user?.email?.split("@")[0];
    if (email) return email;

    // Ultimate fallback
    return "Friend";
};
const Page = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/sign-in");

    const [userSettings, profile] = await Promise.all([
        prisma.userSettings.findUnique({
            where: { userId: user.id }
        }),
        supabase.from("profiles").select("first_name").eq("id", user.id).single()
    ]);

    const displayName = getUserDisplayName({
        ...user,
        ...profile?.data
    });

    return (
        <div className="h-full bg-background">
            <div className=" container flex flex-wrap justify-between   border-b py-5 px-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        <span className="text-sm">{getGreeting()}</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back,{" "}
                        <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            {displayName}
                        </span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <CreateTransactionDialog trigger={
                        <Button >New income</Button>}
                        type="income"
                    />

                    <CreateTransactionDialog trigger={
                        <Button >New expense</Button>}
                        type="expense"
                    />
                </div>
            </div>
            <Separator />
            <div className="container flex flex-wrap gap-4 justify-between py-5 px-10">

                <Overview userSettings={userSettings} />

            </div>
        </div>
    )
}

export default Page