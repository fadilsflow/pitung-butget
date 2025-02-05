import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CurrencySelect } from "./currency-select";

async function Page() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/sign-in");
    }

    return (
        // change the font to inter
        <div className="container max-w-md mx-auto px-4 py-8 space-y-8">
            <header className="text-center space-y-2">
                <h1 className="text-2xl font-semibold font-inter ">
                    Welcome!
                </h1>
                <p className="text-sm text-muted-foreground">
                    Let&apos;s finalize your financial setup
                </p>
            </header>

            <Card className="shadow-sm hover:shadow transition-shadow duration-200 border-none">
                <CardHeader>
                    <CardTitle className="text-lg">Currency Preferences</CardTitle>
                    <CardDescription className="text-xs">
                        Select your primary transaction currency
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <CurrencySelect />
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full text-sm font-medium transition-transform duration-200 hover:scale-[1.02]"
                        asChild
                    >
                        <Link href="/">Complete Setup</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page;