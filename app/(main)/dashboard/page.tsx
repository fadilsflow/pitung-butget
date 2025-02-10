
import { createClient } from "@/app/utils/supabase/server";
import { Button } from "@/components/ui/button";

import { redirect } from "next/navigation";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/overview";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";


const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const getMotivationalMessage = () => {
    const messages = [
        "Let's make today productive!",
        "Ready to take control of your finances?",
        "Your goals are within reach!",
        "Time to check your finances!",
        "What would you like to achieve today?",
        "Let's track your progress together!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
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


    return (
        <div className="h-full bg-background">
            <div className=" container px-10 py-5">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="text-sm">{getGreeting()}</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {getMotivationalMessage()}
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <CreateTransactionDialog trigger={
                            <Button variant={"outline"} className="w-full md:w-auto bg-green-700 border-green-500 hover:bg-green-900  font-bold text-white hover:text-white " >New income</Button>}
                            type="income"
                        />

                        <CreateTransactionDialog trigger={
                            <Button variant={"outline"} className="w-full md:w-auto bg-red-700 border-red-500 hover:bg-red-900  font-bold text-white hover:text-white " >New expense</Button>}
                            type="expense"
                        />
                    </div>
                </div>
            </div>
            <Separator />

            {/* Overview Section */}
            <div className="grid gap-4">
                <Overview userSettings={userSettings} />
            </div>
        </div>

    )
}

export default Page