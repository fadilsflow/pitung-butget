import DropdownProfile from "@/components/DropdownProfile"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { createClient } from "@/app/utils/supabase/server";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
const Page = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const user_metadata = user?.user_metadata;
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            
            <Card className="w-fit h-fit flex flex-col items-center justify-center">
            <CardHeader>
                <Image src={user_metadata?.avatar_url} alt="Profile Picture" width={100} height={100} className="rounded-full" />
            </CardHeader>
            <CardContent>
                <h1>{user_metadata?.full_name}</h1>
                <p>{user_metadata?.email}</p>

            </CardContent>
            <CardFooter>
                <Button>Logout</Button>
            </CardFooter>
            <ModeToggle />
        </Card>
        </div>
    )
}

export default Page