
import { createClient } from "@/app/utils/supabase/server";
import { Button } from "@/components/ui/button";

import { redirect } from "next/navigation";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/overview";
import { prisma } from "@/lib/prisma";


const Page = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const firstName = user?.user_metadata.full_name?.split(" ")[0];
    if (!user) {
        redirect("/sign-in");
    }

    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id
        }
    })

    return (
        <div className="h-full bg-background">
            <div className="container flex flex-wrap border-b justify-between bg-card px-10">
                <div className=" flex flex-wrap items-center justify-between gap-6  py-5">
                    <p className="text-3xl font-bold">
                        Welcome back, {firstName}... 😜
                    </p>
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
            <div className="container flex flex-wrap gap-4 justify-between py-5 px-10">

                <Overview userSettings={userSettings} />

            </div>
        </div>
    )
}

export default Page