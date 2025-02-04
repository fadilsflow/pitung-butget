import LogoutButton from "@/app/(auth)/logout/LogoutButton"
import { createClient } from "@/app/utils/supabase/server";
import Image from "next/image";
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
            <Image src={user_metadata.avatar_url} alt="Avatar" width={100} height={100} className="rounded-full" />
            <h1>{user_metadata.name}</h1>
            <h1>Dashboard</h1>
            <LogoutButton />    
        </div>
    )
}

export default Page