import { redirect } from "next/navigation";

import { createClient } from "@/app/utils/supabase/server";
import { SignForm } from "./SignForm";

export default async function LoginPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  if (data.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignForm />
      </div>
    </div>
  );
}
