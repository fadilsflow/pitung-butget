
import { createClient } from "@/app/utils/supabase/server";

import { redirect } from "next/navigation";


const Page = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/sign-in");
    }

    const user_metadata = user.user_metadata;
    return (
        <div>
            
        </div>
    )
}

export default Page