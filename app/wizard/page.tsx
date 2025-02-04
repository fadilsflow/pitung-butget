import { Separator } from "@/components/ui/separator";

import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CurrencySelect } from "./currency-select";



async function Page() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const user_metadata = user?.user_metadata;
    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="container flex max-w-2xl flex-col items-center justify-between gap-4 p-4">
            <div>
            <h1 className="text-2xl font-bold">Welcome, <span className="ml-2 font-bold">{user_metadata?.full_name}👋🏼</span></h1>
            <h2 className="mt-4 text-center text-base text-muted-foreground">Let&apos;s get started by setting up your currency</h2>
            <h3 className="mt-2 text-center text-sm text-muted-foreground">you can change these settings any time</h3>
            </div>
            <Separator className="w-full" />
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Currency</CardTitle>
                    <CardDescription>Select the currency you want to use</CardDescription>
                </CardHeader>
                <CardContent>
                    <CurrencySelect />
                </CardContent>
                <Separator className="w-full" />
                <CardFooter>
                    <Button className="w-full" asChild>
                        <Link href="/">Done, take me to the dashboard</Link>
                    </Button>
                </CardFooter>
            </Card>
            
        </div>
    )
}
export default Page;