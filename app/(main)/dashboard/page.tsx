
import { createClient } from "@/app/utils/supabase/server";

import { redirect } from "next/navigation";


const Page = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div>
            <h1>hello world</h1>
        </div>
    )
}

export default Page