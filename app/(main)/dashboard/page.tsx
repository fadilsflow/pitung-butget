
import { createClient } from "@/app/utils/supabase/server";
import { Button } from "@/components/ui/button";

import { redirect } from "next/navigation";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";


const Page = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const firstName = user?.user_metadata.full_name?.split(" ")[0];
    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="h-full bg-background">
            <div className="flex flex-col border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 px-10 py-5">
                    <p className="text-3xl font-bold">
                        Welcome back, {firstName}... 😜
                    </p>
                </div>
            </div>
            <div className="container flex flex-wrap gap-4 justify-between py-5 px-10">
                <div className="flex flex-col gap-2 ">
                    <h1 className="text-2xl font-bold">Overview</h1>
                </div>
                <div className="flex items-center gap-3">
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
        </div>
    )
}

export default Page